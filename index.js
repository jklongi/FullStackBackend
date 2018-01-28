const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

morgan.token('json', function (request, response) { return JSON.stringify(request.body) })
app.use(morgan(':method :url :json :status :res[content-length] - :response-time ms'))

var persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.send(`
    <div>
      <div>puhelinluettelossa on ${persons.length} henkilön tiedot</div>
      <div>${new Date()}</div>
    </div>
  `)
})

/* API */

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.post('/api/persons', (request, response) => {

  const person = request.body

  if (person === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  if (!person.name || !person.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  if (persons.some(_person => _person.name === person.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  person.id = Math.floor(Math.random() * 9999999) + 1
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const person = request.body

  if (person === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  if (!person.name || !person.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  _person = persons.find(person => person.id === id)

  if(!_person){
    return response.status(400).json({ error: 'person not found' })
  }

  _person.number = person.number
  _person.name = person.name

  response.json(_person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})





const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
