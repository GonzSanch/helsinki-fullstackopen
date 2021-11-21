const { ApolloServer, gql, UserInputError } = require("apollo-server");
const mongoose = require("mongoose");
const { v1: uuid } = require("uuid");

const Book = require("./models/book");
const Author = require("./models/author");

const MONGODB_URI =
  "mongodb+srv://fullstack:nGmUTD3IceCxSETu@cluster0.qebfq.mongodb.net/library?retryWrites=true";

console.log(`conecting to ${MONGODB_URI}`);

mongoose
  .connect(MONGODB_URI, {
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
    addBook: async (root, args) => {
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
    editAuthor: async (root, args) => {
      const author = await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.born }
      );
      if (!author) {
        throw new UserInputError("Author not found");
      }
      return author;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
