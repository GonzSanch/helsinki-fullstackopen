import blogsServices from '../services/blogs'

const initialState = []

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogsServices.getAll()
        dispatch({
            type: 'INIT_BLOGS',
            data: blogs
        })
    }
}

export const likeBlog = (id) => {
    return async dispatch => {
        const updated = await blogsServices.like(id)
        dispatch({
            type: 'LIKE',
            data: updated
        })
    }
}

export const deleteBlog = (blogToDelete) => {
    return async dispatch => {
        await blogsServices.deleteBlog(blogToDelete.id)
        dispatch({
            type: 'DELETE',
            data: blogToDelete
        })
    }
}

export const createBlog = (content) => {
    return async dispatch => {
        const newBlog = await blogsServices.create(content)
        dispatch({
            type: 'NEW_BLOG',
            data: newBlog
        })
    }
}

export const addComment = (id, content) => {
    return async dispatch => {
        const updatedBlog = await blogsServices.addComment(id, content)
        dispatch({
            type: 'ADD_COMMENT',
            data: updatedBlog
        })
    }
}

const blogReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'INIT_BLOGS':
        return action.data
    case 'LIKE': {
        const id = action.data.id
        const blogToChange = state.find(a => a.id === id)
        const changedBlog = {
            ...blogToChange,
            likes: blogToChange.likes + 1
        }
        return state.map(blog =>
            blog.id !== id ? blog : changedBlog)
    }
    case 'ADD_COMMENT': {
        const id = action.data.id
        return state.map(blog =>
            blog.id !== id ? blog : action.data)
    }
    case 'DELETE':
        return state.filter(blog => blog.id !== action.data.id)
    case 'NEW_BLOG':
        return [...state, action.data]
    default:
        return state
    }
}

export default blogReducer