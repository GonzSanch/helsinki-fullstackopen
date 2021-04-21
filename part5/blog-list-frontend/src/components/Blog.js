import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog }) => {
    const [visible, setVisible] = useState(false)
    const [label, setlabel] = useState('view')

    const toggleVisibility = () => {
        setVisible(!visible)
        setlabel(visible ? 'view' : 'hide')
    }

    const del = () => deleteBlog(blog)

    const updateLike = () => {
        updateBlog({
            id: blog.id,
            likes: blog.likes + 1,
            author: blog.author,
            title: blog.title,
            url: blog.url,
            user: blog.user.id
        })
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    return (
        <div id={blog.id} className='blog' style={blogStyle}>
            {blog.title} {blog.author}
            {visible ?
                <div>
                    <div>{blog.url}</div>
                    <div id='likes'>{blog.likes}
                        <button id='like-button' onClick={updateLike}>like</button>
                    </div>
                    <div>{blog.user.name}</div>
                    <div><button onClick={del}>delete</button></div>
                </div>
                : <div></div>}
            <button id='blog-view' onClick={toggleVisibility}>{label}</button>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    updateBlog: PropTypes.func,
    deleteBlog: PropTypes.func
}

export default Blog