import React, { useState } from 'react'

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
    const handleAuthorChange = ( event ) => {
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
            dispatch(setNotification({ content: exception.response.data.error, status: 'error' }, 5))
        }
    }

    return (
        <div className='formDiv'>
            <h2>Add new Blog</h2>
            <form onSubmit={addBlog}>
                <div>title: <input id="title" value={title} onChange={handleTitleChange} /></div>
                <div>author: <input id="author" value={author} onChange={handleAuthorChange} /></div>
                <div>url: <input id="url" value={url} onChange={handleUrlChange} /></div>
                <div> <button id="createBlog-button" type="submit">create</button> </div>
            </form>
        </div>
    )
}

export default CreateBlogForm