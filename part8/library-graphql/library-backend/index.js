require("dotenv").config();
const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
} = require("apollo-server");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

console.log(`conecting to mongoDB`);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = gql`
  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    addAuthor(name: String!, born: Int): Author
    editAuthor(name: String!, born: Int!): Author
    createUser(username: String!, favouriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`;

const resolvers = {
  Query: {
    authorCount: async () => await Author.countDocuments(),
    bookCount: async () => await Book.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return await Book.find().populate("author");
      }

      let books_filter = {};
      if (args.author) {
        const authorId = await Author.findOne({ name: args.author });
        books_filter = { ...books_filter, author: authorId };
      }
      if (args.genre) books_filter = { ...books_filter, genres: args.genre };
      return await Book.find(books_filter).populate("author");
    },
    allAuthors: async () => await Author.find(),
    me: (root, args, context) => context.currentUser,
  },
  Author: {
    bookCount: (root, args) =>
      Book.collection.countDocuments({ author: root._id }),
  },
  Mutation: {
    addAuthor: async (root, args) => {
      const author = new Author({ ...args });
      try {
        await author.save();
        return author;
      } catch (error) {
        throw new UserInputError("Author invalid name", { invalidArgs: args });
      }
    },
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new UserInputError("Impossible to create Author", {
            invalidArgs: args.name,
          });
        }
      }
      try {
        const book = new Book({ ...args, author });
        await book.save();
        return book;
      } catch (error) {
        throw new UserInputError("Impossible to create Book", {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");
      const author = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.born }
      );
      if (!author) {
        throw new UserInputError("Author not found");
      }
      return author;
    },
    createUser: (root, args) => {
      const user = new User({
        username: args.username,
        favouriteGenre: args.favouriteGenre,
      });

      return user.save().catch((err) => {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
