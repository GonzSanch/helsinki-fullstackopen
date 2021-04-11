import React, { useState, useEffect } from 'react'
import personsService from './services/Persons'

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

const Person = ({ person, DeletePerson }) => (
  <p>{person.name} {person.number} <button onClick={() => DeletePerson(person)}>delete</button></p>
)

const PersonsList = ({ toShow, DeletePerson }) => (
  <div>
  {toShow.map(person =>
    <Person key={person.id} person={person} DeletePerson={DeletePerson}/>
  )}
  </div>
)

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={message.status}>
      {message.content}
    </div>  
  )
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setfilter ] = useState('')
  const [ message, setMessage ] = useState('')
  
  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const AddNewPerson = (event) => {
    event.preventDefault()
    const NewPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
        const id = persons.find(person => person.name === newName).id
        personsService
          .update(id, NewPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessage({content: `Updated ${newName}`, status:'success'})
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            setMessage({content: error.response.data.error, status:'error'})
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
        }
      }
      else {
        personsService
        .create(NewPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage({content: `Added ${newName}`, status:'success'})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage({content: error.response.data.error, status:'error'})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const DeletePerson = (Person) => {
    if (window.confirm(`Delete ${Person.name}?`)) {
      personsService
        .deletePerson(Person.id)
        .then(returnedPerson => {
          setPersons(persons.filter(per => per.id !== Person.id))
          setMessage({content: `Deleted ${Person.name}`, status:'success'})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage({content: `Information of ${Person.name} has already been removed from server`, status:'error'})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
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
      <Notification message={message} />
      <Filter value={filter} handler={handleFilter} />
      <h2>Add a new</h2>
      <AddForm submit={AddNewPerson} value1={newName} handler1={handleNewName} value2={newNumber} handler2={handleNewNumber} />
      <h2>Numbers</h2>
      <PersonsList toShow={personsToShow} DeletePerson={DeletePerson}/>
    </div>
  )
}

export default App;