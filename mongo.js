const mongoose = require('mongoose')

const url = 'mongodb://fullstack:Aurinkopaistaa@ds117178.mlab.com:17178/jlongi'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  name: String,
  number: String,
})

if(process.argv[2] && process.argv[3]){
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3],
  })

  person.save().then(response => {
    console.log(`Lisätäähn henkilö ${person.name} numero ${person.number} luetteloon`)
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(persons => {
    console.log('Puhelinluettelo:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
