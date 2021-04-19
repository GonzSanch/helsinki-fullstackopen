import React, { useState, useEffect } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/Login'
import CreateBlogForm from './components/CreateBlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [createBlogFormVisible, setCreateBlogFormVisible] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const response = await blogService.getAll()
      console.log(`response`, response)
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

  const handleCreate = async (event) => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url
    }

    try {
      const nblog = await blogService.create(newBlog)
      setBlogs(blogs.concat(nblog))
      setMessage({ content: `a new blog ${title} added`, status: 'success' })
      setTitle('')
      setAuthor('')
      setUrl('')
      setTimeout(() => {
        setCreateBlogFormVisible(false)
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage({ content: exception.response.data.error, status: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const createBlogForm = () => {
    const hideWhenVisible = { display: createBlogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: createBlogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreateBlogFormVisible(true)}>new Blog</button>
        </div>
        <div style={showWhenVisible}>
          <CreateBlogForm
            handleSubmit={handleCreate}
            handleTitleChange={({ target }) => setTitle(target.value)}
            handleAuthorChange={({ target }) => setAuthor(target.value)}
            handleUrlChange={({ target }) => setUrl(target.value)}
            title={title}
            author={author}
            url={url}
            message={message}
          />
          <button onClick={() => setCreateBlogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
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
      {createBlogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App