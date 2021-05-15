import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom'

import Blog from './components/Blog'
import LoginForm from './components/Login'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'

import loginService from './services/login'

import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, logOut, setUser } from './reducers/userReducer'
import { initializeUsers } from './reducers/usersReducer'

const Menu = ({ user, handleLogout }) => {
    const padding = {
        paddingRight: 5
    }

    const style = {
        background: 'lightgrey',
        padding: '.5em'
    }

    return (
        <div style={style}>
            <Link to='/' style={padding}>blogs</Link>
            <Link to='/users' style={padding}>users</Link>
            {`${user.username} logged in `}
            <button onClick={handleLogout}>logout</button>
        </div>
    )
}

const App = () => {
    const dispatch = useDispatch()

    const blogs = useSelector(state => state.blogs)
    const user = useSelector(state => state.user)
    const users = useSelector(state => state.users)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const blogFormRef = useRef()

    const userById = (id) => users.find(a => a.id === id)
    const blogById = (id) => blogs.find(a => a.id === id)

    const matchUser = useRouteMatch('/users/:id')
    const matchBlog = useRouteMatch('/blogs/:id')
    const userSelected = matchUser ? userById(matchUser.params.id) : null
    const blogSelected = matchBlog ? blogById(matchBlog.params.id) : null

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    useEffect(() => {
        dispatch(initializeBlogs())
        dispatch(initializeUser())
        dispatch(initializeUsers())
    }, [dispatch])

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password
            })
            dispatch(setUser(user))
            setUsername('')
            setPassword('')
        } catch (exception) {
            dispatch(setNotification({ content: 'Wrong credentials', status: 'error' }, 5))
        }
    }

    const handleLogout = () => {
        dispatch(logOut())
    }

    if (user === null) {
        return (
            <LoginForm
                handleSubmit={handleLogin}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                username={username}
                password={password}
            />
        )
    }

    return (
        <div>
            <Menu handleLogout={handleLogout} user={user}/>
            <h1>Blog list app</h1>
            <Switch>
                <Route path='/users/:id' >
                    {userSelected ?
                        <div id='user'>
                            <h1>{userSelected.username}</h1>
                            <h2>added blogs</h2>
                            <ul>
                                {userSelected.blogs.map(blog =>
                                    <li key={blog.id}>{blog.title}</li>)
                                }
                            </ul>
                        </div>
                        : null}
                </Route>
                <Route path='/users'>
                    <h2>Users</h2>
                    <div id='users'>
                        <table>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td>blogs created</td>
                                </tr>
                                {users.map(user =>
                                    <tr key={user.id}>
                                        <td>
                                            <Link to={`/users/${user.id}`}>{user.username}</Link>
                                        </td>
                                        <td>{user.blogs.length}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Route>
                <Route path='/blogs/:id' >
                    {blogSelected ?
                        <Blog blog={blogSelected} />
                        : 'null'}
                </Route>
                <Route path='/'>
                    <h2>Blogs</h2>
                    <Notification />
                    <Togglable buttonLabel='new blog' ref={blogFormRef}>
                        <CreateBlogForm refparent={blogFormRef} />
                    </Togglable>
                    <div id='blogs'>
                        {blogs
                            .sort((a, b) => b.likes - a.likes)
                            .map(blog =>
                                <div key={blog.id} style={blogStyle}>
                                    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                                </div>
                            )}
                    </div>
                </Route>
            </Switch>
        </div>
    )
}

export default App