import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, deleteBlog }) => {
    const [visible, setVisible] = useState(false)
    const [label, setlabel] = useState('view')

    const showVisible = { display: visible ? '' : 'none' }

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
        <div>
            <div style={blogStyle}>
                {blog.title} {blog.author}
                <div style={showVisible}>
                    <div>{blog.url}</div>
                    <div>{blog.likes}
                        <button onClick={updateLike}>like</button>
                    </div>
                    <div>{blog.user.name}</div>
                    <div><button onClick={del}>delete</button></div>
                </div>
                <button onClick={toggleVisibility}>{label}</button>
            </div>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    updateBlog: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired
}

export default Blog