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

export const useCountry = (name) => {
    const [country, setCountry] = useState(null)

    useEffect(() => {
        async function fetchData() {
            if (name) {
                try {
                    const response = await axios.get(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
                    const data = { data: response.data[0], found: true }
                    setCountry(data)
                } catch (e) {
                    const data = { data: null, found: false }
                    setCountry(data)
                }
            }
        }
        fetchData()
    }, [name])

    return country
}