const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

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
