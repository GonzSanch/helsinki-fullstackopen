import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ value, handler }) => {
  return (
    <div> find countries <input value={value} onChange={handler} /></div>
  )
}

const Country = ({ data }) => {
  const [weather, setWeather] = useState("")
  const [showWeather, setShowWeather] = useState(false)
  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${data.name}`)
      .then(response => {
        setWeather(response.data.current)
        setShowWeather(true)
      })
  }, [data.name])
  if (!showWeather) {
    return (
      <p>loading</p>
    )
  }
  else {
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
        <h2>{`Weather in ${data.name}`}</h2>
        <p><b>temperature:</b> {`${weather.temperature} Celcius`}</p>
        <img src={weather.weather_icons} alt={`weather of ${data.name}`}></img>
        <p><b>wind:</b> {`${weather.wind_speed} mph direction ${weather.wind_dir}`}</p>
      </div>
    )
  }
}

const Countries = ({ data, handler, show }) => {
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
  else if (datalen === 0) {
    return (
      <p>Country not found</p>
    )
  }
  else {
    if (show !== -1) {
      return (
        <Country data={data[show]} />
      )
    }
    else {
      return (
        <>
          {data.map((country, index) =>
            <p key={country.alpha3Code}>{country.name} <button onClick={() => handler(index)}>show</button></p>
          )}
        </>
      )
    }
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [show, setShow] = useState(-1)

  const handleFilter = (event) => {
    setShow(-1)
    setFilter(event.target.value)
  }

  const handleShow = (index) => {
    setShow(index)
  }

  useEffect(() => {
    if (filter) {
      axios
        .get(`https://restcountries.eu/rest/v2/name/${filter}`)
        .then(response => {
          setCountries(response.data)
        })
        .catch(error => {
          setCountries([])
        })
    }
  }, [filter])

  return (
    <div>
      <Filter value={filter} handler={handleFilter} />
      <Countries data={countries} handler={handleShow} show={show} />
    </div>
  )
}

export default App