const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = 3001

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

const logger = morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  })

app.use(express.json())
app.use(logger)

const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id)) : 0
    return maxId + 1
}

const generateRandomId = () => Math.floor(Math.random() * 10**4)

app.get('/', (request, response) => {
    response.end(`API GET '/'`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

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

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    //Use of Math.random method requested in subject
    const person = {
        name: body.name,
        number: body. number,
        id: generateRandomId()
    }

    persons = persons.concat(person)
    
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date
    response.end(`<p>Phonebook has info for ${persons.length} people</p><p>${date.toString()}</p>`)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})