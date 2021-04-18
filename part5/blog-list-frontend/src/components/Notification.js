import React from 'react'
const Notification = ({ message }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={message.status}>
            {message.content}
        </div>
    )
}

export default Notification