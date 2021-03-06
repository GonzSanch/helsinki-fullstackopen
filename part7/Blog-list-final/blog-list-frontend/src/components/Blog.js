import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { likeBlog, addComment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'

const Blog = ({ blog }) => {
    const dispatch = useDispatch()

    const [content, setContent] = useState('')

    // const del = (blogToDelete) => {
    //     if (window.confirm(`Remove ${blogToDelete.title} by ${blogToDelete.author} ?`)) {
    //         try {
    //             dispatch(deleteBlog(blogToDelete))
    //         } catch (e) {
    //             dispatch(setNotification({ content: `blog: ${blogToDelete.name} has already been removed from server`, status: 'error' }), 5)
    //         }
    //     }
    // }

    const update = (id) => {
        try {
            dispatch(likeBlog(id))
        } catch (exception) {
            dispatch(setNotification({ content: exception.response.data.error, status: 'danger' }, 5))
        }
    }

    const handleContent = (event) => {
        setContent(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(blog, { content })
        dispatch(addComment(blog.id, { content }))
    }

    return (
        <div id={blog.id} className='blog'>
            <h1>{blog.title}</h1>
            <div>
                <a>{blog.url}</a>
                <div className='likes' >{blog.likes} likes
                    <Button id='like-button' onClick={() => update(blog.id)}>like</Button>
                </div>
                <div>added by {blog.user.name}</div>
            </div>
            <br />
            <div id='comments'>
                <h3>comments</h3>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Control
                            id="content"
                            value={content}
                            onChange={handleContent}
                        />
                        <Button variant='primary' type='submit'>add comment</Button>
                    </Form.Group>
                </Form>
                <ul>
                    {blog.Comments.map((comment, key) =>
                        <li key={key}>{comment.content}</li>
                    )}
                </ul>
            </div>
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired
}

export default Blog