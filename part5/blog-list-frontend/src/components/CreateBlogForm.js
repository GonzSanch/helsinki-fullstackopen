import React, { useState } from 'react'
import Notification from './Notification'

const CreateBlogForm = ({
    createBlog,
    message
}) => {
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
        createBlog({
            title,
            author,
            url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <Notification message={message} />
            <h2>Add new Blog</h2>
            <form onSubmit={addBlog}>
                <div>title: <input value={title} onChange={handleTitleChange} /></div>
                <div>author: <input value={author} onChange={handleAuthorChange} /></div>
                <div>url: <input value={url} onChange={handleUrlChange} /></div>
                <div> <button type="submit">create</button> </div>
            </form>
        </div>
    )
}

export default CreateBlogForm