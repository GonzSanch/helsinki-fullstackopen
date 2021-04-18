import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] =useState('')
  const [author, setAuthor] =useState('')
  const [url, setUrl] =useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    ) 
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
      setMessage({ content: 'Wrong credentials', status:'error' })
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
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage({ content: exception.response.data.error, status: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h1>log in to application</h1>
        <Notification message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username
              <input
              type="text"
              autoComplete="username"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
              />
          </div>
          <div>
            password
              <input
              type="password"
              autoComplete="current-password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
              />
          </div>
          <button type='submit'>login</button>
        </form>
        </div>
    )
  }
  
  return (
    <div>
      <Notification message={message} />
      <h2>Add new Blog</h2>
      <form onSubmit={handleCreate}>
        <div>title: <input value={title} onChange={(event) => {setTitle(event.target.value)}}/></div>
        <div>author: <input value={author} onChange={(event) => {setAuthor(event.target.value)}}/></div>
        <div>url: <input value={url} onChange={(event) => {setUrl(event.target.value)}}/></div>
        <div> <button type="submit">create</button> </div>
      </form>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App