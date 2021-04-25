const initialState = ''

export const voteNotification = (content) => {
    return {
        type: 'VOTE_NOTIFICATION',
        data: content
    }
}

export const createAnecdoteNotification = (content) => {
    return {
        type: 'NEW_ANECDOTE_NOTIFICATION',
        data: content
    }
}

export const removeNotification = () => {
    return {
        type: 'REMOVE_NOTIFICATION',
        data: ''
    }
}

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'VOTE_NOTIFICATION': {
            console.log(`action.data`, action.data)
            return `you voted ${action.data}`
        }
        case 'NEW_ANECDOTE_NOTIFICATION':
            {
                console.log(`action.data`, action.data)
                return `created new anecdote ${action.data}`
            }
        case 'REMOVE_NOTIFICATION':
            return initialState
        default:
            return state
    }
}

export default notificationReducer