import React, { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/Login'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [message, setMessage] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const blogFormRef = useRef()

    useEffect(() => {
        async function fetchData() {
            const response = await blogService.getAll()
            setBlogs(response)
        }
        try {
            fetchData()
        } catch (e) {
            console.error(e)
        }
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password
            })

            window.localStorage.setItem(
                'loggedUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setMessage({ content: 'Wrong credentials', status: 'error' })
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    const handleLogout = () => {
        setUser(null)
        if (window.localStorage.getItem('loggedUser')) {
            window.localStorage.removeItem('loggedUser')
        }
    }

    const createBlog = async (newBlog) => {
        try {
            const nblog = await blogService.create(newBlog)
            setBlogs(blogs.concat(nblog))
            blogFormRef.current.toggleVisibility()
            setMessage({ content: `a new blog ${newBlog.title} added`, status: 'success' })
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        } catch (exception) {
            setMessage({ content: exception.response.data.error, status: 'error' })
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    const updateBlog = async (updatedBlog) => {
        try {
            const id = updatedBlog.id
            const ublog = await blogService.update(updatedBlog)
            setBlogs(blogs.map(blog => blog.id !== id ? blog : ublog))
        } catch (exception) {
            setMessage({ content: exception.response.data.error, status: 'error' })
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    const deleteBlog = async (blogToDelete) => {
        if (window.confirm(`Remove ${blogToDelete.title} by ${blogToDelete.author} ?`)) {
            try {
                await blogService.deleteBlog(blogToDelete.id)
                setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
                setMessage({ content: `blog: ${blogToDelete.title} deleted`, status: 'success' })
                setTimeout(() => {
                    setMessage(null)
                }, 5000)
            } catch (exception) {
                setMessage({ content: `blog: ${blogToDelete.name} has already been removed from server`, status:'error' })
                setTimeout(() => {
                    setMessage(null)
                }, 5000)
            }
        }
    }

    if (user === null) {
        return (
            <LoginForm
                handleSubmit={handleLogin}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                username={username}
                password={password}
                message={message}
            />
        )
    }

    return (
        <div>
            <h1>Blog list app</h1>
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>logout</button>
            <h2>blogs</h2>
            <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <CreateBlogForm createBlog={createBlog} message={message} />
            </Togglable>
            {blogs
                .sort((a, b) => b.likes - a.likes)
                .map(blog =>
                    <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog}/>
                )}
        </div>
    )
}

export default App