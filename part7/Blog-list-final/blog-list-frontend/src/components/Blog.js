import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'

const Blog = ({ blog }) => {
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false)
    const [label, setlabel] = useState('view')

    const toggleVisibility = () => {
        setVisible(!visible)
        setlabel(visible ? 'view' : 'hide')
    }

    const del = (blogToDelete) => {
        if (window.confirm(`Remove ${blogToDelete.title} by ${blogToDelete.author} ?`)) {
            try {
                dispatch(deleteBlog(blogToDelete))
            } catch (e) {
                dispatch(setNotification({ content: `blog: ${blogToDelete.name} has already been removed from server`, status: 'error' }), 5)
            }
        }
    }

    const update = (id) => {
        try {
            dispatch(likeBlog(id))
        } catch (exception) {
            dispatch(setNotification({ content: exception.response.data.error, status: 'error' }, 5))
        }
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
                    <div className='likes' >{blog.likes}
                        <button id='like-button' onClick={() => update(blog.id)}>like</button>
                    </div>
                    <div>{blog.user.name}</div>
                    <div><button onClick={() => del(blog)}>delete</button></div>
                </div>
                : <div></div>}
            <button className='blog-view' onClick={toggleVisibility}>{label}</button>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired
}

export default Blog