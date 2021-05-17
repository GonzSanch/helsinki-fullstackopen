import React, { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_PERSONS } from './queries'
import Persons from './components/Persons'
import PersonForm from './components/CreatePerson'
import PhoneForm from './components/PhoneForm'

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }

  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)

  const result = useQuery(ALL_PERSONS, {
    // pollInterval: 2000
  })

  if (result.loading) {
    return <div>loading...</div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <PersonForm setError={notify}/>
      <Persons persons={result.data.allPersons} />
      <PhoneForm setError={notify}/>
    </div>
  )
}

export default App