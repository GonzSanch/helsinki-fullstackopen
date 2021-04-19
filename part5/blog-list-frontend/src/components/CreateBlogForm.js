import React from 'react'
import Notification from './Notification'

const CreateBlogForm = ({
    handleSubmit,
    handleTitleChange,
    handleAuthorChange,
    handleUrlChange,
    title,
    author,
    url,
    message
}) => (
    <div>
        <Notification message={message} />
        <h2>Add new Blog</h2>
        <form onSubmit={handleSubmit}>
            <div>title: <input value={title} onChange={handleTitleChange} /></div>
            <div>author: <input value={author} onChange={handleAuthorChange} /></div>
            <div>url: <input value={url} onChange={handleUrlChange} /></div>
            <div> <button type="submit">create</button> </div>
        </form>
    </div>
)

export default CreateBlogForm