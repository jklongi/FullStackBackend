const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./Models/person')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('json', function (request, response) { return JSON.stringify(request.body) })
app.use(morgan(':method :url :json :status :res[content-length] - :response-time ms'))


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      res.send(`
        <div>
          <div>puhelinluettelossa on ${persons.length} henkilön tiedot</div>
          <div>${new Date()}</div>
        </div>
      `)
    })
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => persons.map(Person.format))
    .then(formattedPersons => response.json(formattedPersons))
    .catch(error => {
      console.log(error)
      response.status(404).end()
    })
})

app.post('/api/persons', (request, response) => {

  if (request.body === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  const person = new Person({
    name: request.body.name,
    number: request.body.number
  })

  person.save()
    .then(savedPerson => Person.format(savedPerson))
    .then(formattedPerson => response.json(formattedPerson))
    .catch(error => {
      console.log(error.message)
      response.status(404).end()
    })

})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        return response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    }).catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (request, response) => {
  const person = {
    name: request.body.name,
    number: request.body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedPerson => Person.format(updatedPerson))
    .then(formattedPerson => {
      response.json(formattedPerson)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})





const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
