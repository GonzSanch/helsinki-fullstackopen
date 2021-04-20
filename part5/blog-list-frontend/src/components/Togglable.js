import React, { useState, useImperativeHandle } from 'react'
import PropType from 'prop-types'

const Togglable = React.forwardRef((props, ref) => {
    const [visible, setVisible] = useState(false)

    const hideVisible = { display: visible ? 'none' : '' }
    const showVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <div>
            <div style={hideVisible}>
                <button onClick={toggleVisibility}>{props.buttonLabel}</button>
            </div>
            <div style={showVisible} className="togglableContent">
                {props.children}
                <button onClick={toggleVisibility}>cancel</button>
            </div>
        </div>
    )
})

Togglable.displayName = 'Togglable'

Togglable.propType = {
    buttonLabel: PropType.string.isRequired
}

export default Togglable