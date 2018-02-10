const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, 'Username already taken'],
    required: [true, 'Username is mandatory']
  },
  name: {
    type: String,
    required: [true, 'Name is mandatory']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is mandatory']
  },
  adult: {
    type: Boolean,
    default: true
  },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

module.exports = mongoose.model('User', userSchema)
