import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleclick }) => {
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleclick}>vote</button>
            </div>
        </div>
    )
}

const AnecdoteList = () => {
    const dispactch = useDispatch()
    const anecdotes = useSelector(state =>
        state.anecdotes
            .filter((a) => a.content
                .toLowerCase()
                .includes(state.filter))
            .sort((a, b) => b.votes - a.votes
    ))

    const voteAction = (anecdote) => {
        dispactch(voteAnecdote(anecdote.id))
        dispactch(setNotification(`you voted ${anecdote.content}`, 5))
    }

    return (
        <div>
            <h2>Anecdotes</h2>
            {anecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleclick={() => voteAction(anecdote)}
                />
            )}
        </div>
    )
}

export default AnecdoteList