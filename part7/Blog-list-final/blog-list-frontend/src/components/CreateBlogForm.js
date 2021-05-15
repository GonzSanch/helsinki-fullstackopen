import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const CreateBlogForm = ({ refparent }) => {

    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleAuthorChange = (event) => {
        setAuthor(event.target.value)
    }
    const handleUrlChange = (event) => {
        setUrl(event.target.value)
    }

    const addBlog = (event) => {
        event.preventDefault()
        try {
            dispatch(createBlog({ title, author, url }))
            refparent.current.toggleVisibility()
            dispatch(setNotification({ content: `a new blog ${title} added`, status: 'success' }, 5))
            setTitle('')
            setAuthor('')
            setUrl('')
        } catch (exception) {
            dispatch(setNotification({ content: exception.response.data.error, status: 'danger' }, 5))
        }
    }

    return (
        <div className='formDiv'>
            <h2>Add new Blog</h2>
            <Form onSubmit={addBlog}>
                <Form.Group>
                    <Form.Label>title: </Form.Label>
                    <Form.Control
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                    />
                    <Form.Label>author: </Form.Label>
                    <Form.Control
                        id="author"
                        value={author}
                        onChange={handleAuthorChange}
                    />
                    <Form.Label>url: </Form.Label>
                    <Form.Control
                        id="url"
                        value={url}
                        onChange={handleUrlChange}
                    />
                    <Button variant='primary' type='submit'>create</Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default CreateBlogForm