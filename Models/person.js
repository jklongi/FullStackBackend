const mongoose = require('mongoose')

const url = 'mongodb://fullstack:Aurinkopaistaa@ds117178.mlab.com:17178/jlongi'

mongoose.connect(url)
mongoose.Promise = global.Promise

var PersonSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  number: String,
})

PersonSchema.statics.format = function(person){
  return { name: person.name, number: person.number, id: person._id }
}

const Person = mongoose.model('Person', PersonSchema)

module.exports = Person
