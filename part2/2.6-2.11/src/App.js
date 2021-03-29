import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import axios from 'axios'

const Filter = ({ value, handler }) => (
  <div> filter shown with <input value={value} onChange={handler} /></div>
)

const AddForm = ({ submit, value1, handler1, value2, handler2 }) => (
  <form onSubmit={submit}>
  <div> name: <input value={value1} onChange={handler1} /></div>
  <div> number: <input value={value2} onChange={handler2} /></div>
  <div> <button type="submit">add</button> </div>
  </form>
)

const Person = ({ name, number}) => (
  <p>{name} {number}</p>
)

const PersonsList = ({ toShow }) => (
  <div>
  {toShow.map(person =>
    <Person key={person.name} name={person.name} number={person.number} />
  )}
  </div>
)

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setfilter ] = useState('')
  
  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const AddNewPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const NewPerson = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(NewPerson))
      setNewName('')
      setNewNumber('')
    }
  }
  const handleNewName = (event) => {
    setNewName(event.target.value)
  }
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilter = (event) => {
    setfilter(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} handler={handleFilter} />
      <h2>Add a new</h2>
      <AddForm submit={AddNewPerson} value1={newName} handler1={handleNewName} value2={newNumber} handler2={handleNewNumber} />
      <h2>Numbers</h2>
      <PersonsList toShow={personsToShow} />
    </div>
  )
}

export default App;
