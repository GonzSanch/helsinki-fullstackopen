import React, {useState} from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Anecdote = ({ index, anecdotes, points }) => (
    <>
    <p>{anecdotes[index]}</p>
    <p>has {points[index]} votes</p>
    </>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Array(6).fill(0))
  const setToSelected = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }
  const setToPoints = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)
  }
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <Anecdote index={selected} anecdotes={anecdotes} points={points} />
      <Button handleClick={setToPoints} text='vote'/>
      <Button handleClick={setToSelected} text='next anecdote'/>
      <h1>Anecdote with most votes</h1>
      <Anecdote index={points.indexOf(Math.max(...points))} anecdotes={anecdotes} points={points} />
    </div>
  )
}

export default App