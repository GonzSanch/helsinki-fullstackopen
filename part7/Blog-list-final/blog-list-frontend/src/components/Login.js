import React from 'react'
import PropType from 'prop-types'
import { Button, Form } from 'react-bootstrap'

import Notification from './Notification'

const LoginForm = ({
    handleSubmit,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password
}) => (
    <div>
        <h1>log in to application</h1>
        <Notification />
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    name="Username"
                    onChange={handleUsernameChange}
                />
                <Form.Label>Password</Form.Label>
                <Form.Control
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    name="Password"
                    onChange={handlePasswordChange}
                />
                <Button variant='primary' type='submit'>login</Button>
            </Form.Group>
        </Form>
    </div>
)

LoginForm.propType = {
    handleSubmit: PropType.func.isRequired,
    handleUsernameChange: PropType.func.isRequired,
    handlePasswordChange: PropType.func.isRequired,
    username: PropType.string,
    password: PropType.string
}

export default LoginForm