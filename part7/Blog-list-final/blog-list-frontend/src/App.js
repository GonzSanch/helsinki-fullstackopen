import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
// , Link, useRouteMatch, Redirect

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

const App = () => {
    const dispatch = useDispatch()

    const blogs = useSelector(state => state.blogs)
    const user = useSelector(state => state.user)
    const users = useSelector(state => state.users)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const blogFormRef = useRef()

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
            <h1>Blog list app</h1>
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>logout</button>
            <Switch>
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
                                        <td>{user.username}</td>
                                        <td>{user.blogs.length}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
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
                                <Blog key={blog.id} blog={blog} />
                            )}
                    </div>
                </Route>
            </Switch>
        </div>
    )
}

export default App