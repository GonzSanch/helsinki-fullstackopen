import React from 'react'
import Notification from './Notification'

const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password,
    message
}) => (
    <div>
        <h1>log in to application</h1>
        <Notification message={message} />
        <form onSubmit={handleSubmit}>
            <div>
                username
          <input
                    type="text"
                    autoComplete="username"
                    value={username}
                    name="Username"
                    onChange={handleUsernameChange}
                />
            </div>
            <div>
                password
          <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    name="Password"
                    onChange={handlePasswordChange}
                />
            </div>
            <button type='submit'>login</button>
        </form>
    </div>
)

export default LoginForm