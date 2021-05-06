import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    return {
        type,
        value,
        onChange
    }
}

export const useResource = (baseUrl) => {
    const [resources, setResources] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(baseUrl)
                setResources(response.data)
            } catch (e) {
                console.error(e)
            }
        }
        fetchData()
    }, [baseUrl])

    const create = async (resource) => {
        const response = await axios.post(baseUrl, resource)
        setResources(resources.concat(resource))
        return response.data
    }

    const service = {
        create
    }

    return [
        resources, service
    ]
}