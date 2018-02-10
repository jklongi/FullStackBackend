const User = require('../models/user')

const initialUsers = [
  {
    username: 'jlongi',
    name: 'Joonas',
    adult: true,
    passwordHash: 'joonas'
  },
  {
    username: 'peksu',
    name: 'Pekka',
    adult: false,
    passwordHash: 'pekka'
  }
]

const usersInDb = async () => {
  return await User.find({})
}


module.exports = {
  initialUsers, usersInDb
}
