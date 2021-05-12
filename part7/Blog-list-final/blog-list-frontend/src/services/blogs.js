import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
    token = `bearer ${newToken}`
}

const getAll = async () => {
    const request = await axios.get(baseUrl)
    return request.data
}

const create = async (newObject) => {
    const config = {
        headers: { Authorization: token }
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = async (updatedObject) => {
    const config = {
        headers: { Authorization: token }
    }
    const url = baseUrl + '/' + updatedObject.id
    const response = await axios.put(url, updatedObject, config)
    return response.data
}

const deleteBlog = async (id) => {
    const config = {
        headers: { Authorization: token }
    }

    const url = baseUrl + '/' + id
    const response = await axios.delete(url, config)
    return response.data
}

export default { getAll, create, setToken, update, deleteBlog }