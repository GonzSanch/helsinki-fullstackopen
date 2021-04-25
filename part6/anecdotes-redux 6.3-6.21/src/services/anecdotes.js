import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const updateAnecdote = async (id) => {
    const url = baseUrl+'/'+id
    const toUpdate = await axios.get(url)
    toUpdate.data.votes += 1
    const updated = await axios.put(url, toUpdate.data)
    return updated.data
}

const newAnecdote = async (content) => {
    const object = { content, votes: 0 }
    const response = await axios.post(baseUrl, object)
    return response.data
}

const anecdote = {
    getAll,
    newAnecdote,
    updateAnecdote
}

export default anecdote