const { ApolloServer, gql, UserInputError } = require('apollo-server')
const { v1: uuid } = require('uuid')

let authors = [
    {
        name: 'Robert Martin',
        id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
        born: 1821
    },
    {
        name: 'Joshua Kerievsky',
        id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    {
        name: 'Sandi Metz',
        id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
]

let books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: 'Robert Martin',
        id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: 'Robert Martin',
        id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: 'Martin Fowler',
        id: "afa5de00-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: 'Joshua Kerievsky',
        id: "afa5de01-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'patterns']
    },
    {
        title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: 'Sandi Metz',
        id: "afa5de02-344d-11e9-a414-719c6709cf3e",
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: 'Fyodor Dostoevsky',
        id: "afa5de03-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'crime']
    },
    {
        title: 'The Demon ',
        published: 1872,
        author: 'Fyodor Dostoevsky',
        id: "afa5de04-344d-11e9-a414-719c6709cf3e",
        genres: ['classic', 'revolution']
    }
]

const typeDefs = gql`
    type Book {
        title: String!
        author: String!
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
        addAuthor(
            name: String!
            born: Int
        ): Author
        editAuthor(
            name: String!
            born: Int!
        ): Author
    }
`

const resolvers = {
    Query: {
        authorCount: () => authors.length,
        bookCount: () => books.length,
        allBooks: (root, args) => {
            if (!args.author && !args.genre) {
                return books
            }

            let books_filter = books

            if (args.author) {
                books_filter = books_filter.filter(b => b.author === args.author)
            }
            if (args.genre) {
                books_filter = books_filter.filter(b => b.genres.includes(args.genre))
            }
            return books_filter
        },
        allAuthors: () => authors
    },
    Author: {
        bookCount: (root, args) =>
            books.filter(b => b.author === root.name).length
    },
    Mutation: {
        addAuthor: (root, args) => {
            if (authors.find(a => a.name === args.name)) {
                throw new UserInputError('Name must be unique', {
                    invalidArgs: args.name
                })
            }
            const author = { ...args, id: uuid() }
            authors = authors.concat(author)
            return author
        },
        addBook: (root, args) => {
            if (books.find(b => b.title === args.title)) {
                throw new UserInputError('Name must be unique', {
                    invalidArgs: args.name
                })
            }

            if (!authors.find(a => a.name === args.author)) {
                const author = { name: args.author, id: uuid() }
                authors = authors.concat(author)
            }

            const book = { ...args, id: uuid() }
            books = books.concat(book)
            return book
        },
        editAuthor: (root, args) => {
            const author = authors.find(a => a.name === args.name)
            if (!author) {
                return null
            }

            const updatedAuthor = { ...author, born: args.born }
            authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
            return updatedAuthor
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})