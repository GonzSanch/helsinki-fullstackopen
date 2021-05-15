import React, { useState, useImperativeHandle } from 'react'
import { Button } from 'react-bootstrap'
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
                <Button variant='secondary' onClick={toggleVisibility}>{props.buttonLabel}</Button>
            </div>
            <div style={showVisible} className="togglableContent">
                {props.children}
                <Button variant='secondary' onClick={toggleVisibility}>cancel</Button>
            </div>
        </div>
    )
})

Togglable.displayName = 'Togglable'

Togglable.propType = {
    buttonLabel: PropType.string.isRequired
}

export default Togglable