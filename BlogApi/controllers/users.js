const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { likes: 1, author: 1, title: 1, url: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  try{
    const body = request.body
    const saltRounds = 10
    if(body.password.length < 3){
      return response.status(400).json({ error: 'Password too short' })
    }
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      adult: body.adult,
      passwordHash
    })
    const savedUser = await user.save()
    response.json(savedUser)
  } catch(exception){
    if(exception.code === 11000){
      return response.status(400).json({ error: 'Username already taken' })
    }
    response.status(500).json({ error: 'Something went wrong' })
  }
})

module.exports = usersRouter
