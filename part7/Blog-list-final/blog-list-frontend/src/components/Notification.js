import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
    const message = useSelector(state => state.notification)
    if (message === null) {
        return null
    }
    console.log('inside')
    return (
        <div className={message.status}>
            {message.content}
        </div>
    )
}

export default Notification