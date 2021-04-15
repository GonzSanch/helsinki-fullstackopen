const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const Blog = require('../models/blogs')
const User = require('../models/users')

let authToken

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await User.insertMany(await helper.initialUsers())
    const root = await User.findOne({ username: 'root' })

    const blogs = helper.initialBlogs
        .map(blog => ({ ...blog, user: root._id }))

    await Blog.insertMany(blogs)

    const response = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
    authToken = response.body.token
})

test('id is defined in blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const response = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-type', /application\/json/)

    expect(response.body.id).toBeDefined()
})


describe('get blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-type', /application\/json/)
    })


    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')

        const contents = response.body.map(r => r.title)
        expect(contents).toContain(
            'Type wars'
        )
    })
})

describe('post a blog', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'New Blog on the post',
            author: 'Tester',
            url: 'localhost',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${authToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const contents = blogsAtEnd.map(r => r.title)
        expect(contents).toContain('New Blog on the post')
    })

    test('a valid blog can not be added without auth', async () => {
        const newBlog = {
            title: 'New Blog on the post',
            author: 'Tester',
            url: 'localhost',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            author: 'Tester',
            url: 'localhost',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${authToken}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
        const newBlog = {
            title: 'New blog',
            author: 'Tester',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${authToken}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('if likes is missing default to 0', async () => {
        const newBlog = {
            title: 'New blog',
            author: 'Tester',
            url: 'localhost'
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${authToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const newBlogInDb = blogsAtEnd[blogsAtEnd.length - 1]
        expect(newBlogInDb.likes).toBe(0)
    })
})

describe('Specific blog', () => {

    let guestToken

    beforeEach(async () => {
        const guestResponse = await api
            .post('/api/login')
            .send({ username: 'guest', password: 'guestSecret' })
        guestToken = guestResponse.body.token
    })

    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

        expect(resultBlog.body).toEqual(processedBlogToView)
    })

    test('a blog can be deleted', async () => {
        const blogAtStart = await helper.blogsInDb()
        const blogToDelete = blogAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `bearer ${authToken}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const contents = blogsAtEnd.map(r => r.title)
        expect(contents).not.toContain(blogToDelete.title)
    })

    test('a blog can not be deleted by other user', async () => {
        const blogAtStart = await helper.blogsInDb()
        const blogToDelete = blogAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `bearer ${guestToken}`)
            .expect(401)
    })
})

describe('Update blog', () => {

    test('a blog can be updated', async () => {
        const blogAtStart = await helper.blogsInDb()
        const blogToUpdate = blogAtStart[0]

        const updateProperties = {
            author: 'Darwin',
            likes: 5
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `bearer ${authToken}`)
            .send(updateProperties)
            .expect(200)

        const updatedBlog = await helper.blogWithId(blogToUpdate.id)
        expect(updatedBlog.author).toBe('Darwin')
        expect(updatedBlog.likes).toBe(5)
    })
})

describe('Test users', () => {

    test('create a new fresh user', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'gsanchez',
            name: 'Gonzalo',
            password: 'someCamelCaseSecret'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(users => users.username)
        expect(usernames).toContain(newUser.username)
    })

    test('create a new user with a username that already exist', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Gonzalo',
            password: 'someCamelCaseSecret'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(usersAtStart.length).toEqual(usersAtStart.length)
    })

    test('create a user without username must fail', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'Gonzalo',
            password: 'someCamelCaseSecret'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(usersAtStart.length).toEqual(usersAtStart.length)
    })

    test('create a user without password must fail', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'gsanchez',
            name: 'Gonzalo'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(usersAtStart.length).toEqual(usersAtStart.length)
    })

    test('create a user with username less than 3 chars must fail', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'gs',
            name: 'Gonzalo',
            password: 'someCamelCaseSecret'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(usersAtStart.length).toEqual(usersAtStart.length)
    })

    test('create a user without password less than 3 chars must fail', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'gsanchez',
            name: 'Gonzalo',
            password: 'so'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(usersAtStart.length).toEqual(usersAtStart.length)
    })

    test('get all users', async () => {
        const usersAtStart = await helper.usersInDb()

        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toEqual(usersAtStart.length)
        expect(response.body).toEqual(usersAtStart)
    })

    test('get single user by id', async () => {
        const usersAtStart = await helper.usersInDb()
        const userToFind = usersAtStart[0].id

        const response = await api
            .get(`/api/users/${userToFind}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toEqual(usersAtStart[0])
    })
})


afterAll(() => {
    mongoose.connection.close()
})