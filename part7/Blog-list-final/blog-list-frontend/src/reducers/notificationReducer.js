const initialState = ''

let timeoutID

export const setNotification = (content, timeval) => {
    return dispatch => {
        if (timeoutID) clearTimeout(timeoutID)
        dispatch({
            type: 'SET_NOTIFICATION',
            data: content
        })
        timeoutID = setTimeout(() => {
            dispatch({
                type: 'REMOVE'
            })
        }, timeval * 1000)
    }
}

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
    case 'SET_NOTIFICATION':
        return action.data
    case 'REMOVE':
        return ''
    default:
        return state
    }
}

export default notificationReducer