require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const person = require('./models/person')
const Person = require('./models/person')
const app = express()
const PORT = process.env.PORT

const logger = morgan(function (tokens, req, res) {
    const ret = [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
    ]
    if (tokens.method(req, res) === 'POST') ret.push(JSON.stringify(req.body))

    return ret.join(' ')
  })

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(logger)

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.removeById(request.params.id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.get('/info', (request, response) => {
    const date = new Date
    response.end(`<p>Phonebook has info for ${persons.length} people</p><p>${date.toString()}</p>`)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})