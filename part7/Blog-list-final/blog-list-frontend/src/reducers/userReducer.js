import blogsServices from '../services/blogs'

const initialState = null

export const initializeUser = () => {
    return dispatch => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            blogsServices.setToken(user.token)
            dispatch({
                type: 'INIT_USER',
                data: user
            })
        }
    }
}

export const setUser = (user) => {
    return dispatch => {
        window.localStorage.setItem('loggedUser', JSON.stringify(user))
        blogsServices.setToken(user.token)
        dispatch({
            type: 'SET_USER',
            data: user
        })
    }
}

export const logOut = () => {
    return dispatch => {
        if (window.localStorage.getItem('loggedUser')) {
            window.localStorage.removeItem('loggedUser')
        }
        dispatch({
            type: 'REMOVE_USER',
            data: null
        })
    }
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'INIT_USER':
        return action.data
    case 'SET_USER':
        return action.data
    case 'REMOVE_USER':
        return null
    default:
        return state
    }
}

export default userReducer