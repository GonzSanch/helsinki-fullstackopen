import anecdotesService from '../services/anecdotes'

const initialState = []

export const voteAnecdote = (id) => {
  return async dispatch => {
    const updated = await anecdotesService.updateAnecdote(id)
    dispatch({
      type: 'VOTE',
      data: updated
    })
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAne = await anecdotesService.newAnecdote(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAne
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

const anecdoteReducer = (state = initialState, action) => {

  switch (action.type) {
    case 'NEW_ANECDOTE': {
      return [...state, action.data]
    }
    case 'VOTE': {
      const id = action.data.id
      const anecdoteToChange = state.find(a => a.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1 
      }
      return state.map(anecdote => 
        anecdote.id !== id ? anecdote : changedAnecdote)
    }
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export default anecdoteReducer