import usersServices from '../services/users'

const initialState = []

export const initializeUsers = () => {
    return async dispatch => {
        const users = await usersServices.getAll()
        dispatch({
            type: 'INIT_USERS',
            data: users
        })
    }
}

const usersReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'INIT_USERS':
        return action.data
    default:
        return state
    }
}

export default usersReducer