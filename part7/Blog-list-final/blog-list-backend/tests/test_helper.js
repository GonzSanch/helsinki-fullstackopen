const bcrypt = require('bcrypt')

const Blog = require('../models/blogs')
const User = require('../models/users')

const initialUsers = async () => {
    const hash1 = await bcrypt.hash('sekret', 10)
    const hash2 = await bcrypt.hash('guestSecret', 10)

    const users = [
        {
            username: 'root',
            name: 'root',
            passwordHash: hash1
        },
        {
            username: 'guest',
            name: 'Sr Guest',
            passwordHash: hash2
        }
    ]
    return users
}

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
    }
]

const nonExistingId = async () => {
    const blog = new Blog(
        {
            title: 'removal obj',
            author: 'noe'
        }
    )
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    return blogs.map(blog => blog.toJSON())
}

const blogWithId = async (id) => {
    const blog = await Blog.findById(id)
        .populate('user', { username: 1, name: 1 })
    return blog.toJSON()
}

const usersInDb = async () => {
    const users = await User.find({})
        .populate('blogs', { title: 1, author: 1, url: 1 })
    return users.map(user => user.toJSON())
}

const userWithId = async (id) => {
    const user = await User.findById(id)
        .populate('blogs', { title: 1, author: 1, url: 1 })
    return user.toJSON()
}

module.exports = {
    initialBlogs,
    initialUsers,
    nonExistingId,
    blogsInDb,
    blogWithId,
    usersInDb,
    userWithId
}