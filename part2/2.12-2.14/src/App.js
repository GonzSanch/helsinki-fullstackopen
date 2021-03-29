import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ value, handler }) => (
  <div> find countries <input value={value} onChange={handler} /></div>
)

const Country = ({ data }) => {
  return (
    <div>
      <h1>{data.name}</h1>
      <p>capital {data.capital}</p>
      <p>population {data.population}</p>
      <h2>languages</h2>
      <ul>
        {data.languages.map(language =>
          <li key={language.iso639_1}>{language.name}</li>
          )}
      </ul>
      <img src={data.flag} alt={`flag of ${data.name}`} width="150" height="100"></img>
    </div>
  )
}

const Countries = ({ data }) => {
  const datalen = data.length
  if (datalen > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }
  else if (datalen === 1) {
    return (
      <Country data={data[0]} />
    )
  }
  else {
    return (
      <>
        {data.map(country =>
          <p key={country.alpha3Code}>{country.name}</p>
        )}
      </>
    )}
}

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ filter, setfilter ] = useState('')

  const handleFilter = (event) => {
    setfilter(event.target.value)
  }
  
  useEffect(() => {
    if (filter) {
      axios
        .get(`https://restcountries.eu/rest/v2/name/${filter}`)
        .then(response => {
          setCountries(response.data)
        })
    }
  }, [filter])

  return (
    <div>
      <Filter value={filter} handler={handleFilter} />
      <Countries data={countries} />
    </div>
  )
}

export default App