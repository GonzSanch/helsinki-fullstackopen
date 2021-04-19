const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog
        .findById(request.params.id)
        .populate('user', { username: 1, name: 1 })

    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (blog.user.toString() === user._id.toString()) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        return response.status(401).json({ error: 'token invalid' })
    }
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url || '',
        likes: body.likes || 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === user._id.toString()) {
        const opts = { new: true, runValidators: true, context: 'query' }
        const updatedBlog = await Blog
            .findByIdAndUpdate(request.params.id, body, opts)
            .populate('user', { username: 1, name: 1 })
        response.json(updatedBlog)
    } else {
        return response.status(401).json({ error: 'token invalid' })
    }
})

module.exports = blogsRouter