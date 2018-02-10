const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { initialUsers, usersInDb } = require('./test_helper_user')


beforeEach(async () => {
  await User.remove({})
  const userObjects = initialUsers.map(user => new User(user))
  await Promise.all(userObjects.map(user => user.save()))
})

describe('Users', () => {
  describe('GET', () => {
    test('users are returned as json', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('users has initially 2 users', async () => {
      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
      expect(response.body.length).toEqual(2)
    })
  })

  describe('POST', () => {
    test('valid user can be added', async () => {
      const usersInDatabase = await usersInDb()
      await api
        .post('/api/users')
        .send({
          name: 'uusi',
          username: 'uusinimi',
          password: 'uusi',
          adult: false
        })
        .expect(200)
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersInDatabase.length + 1)
    })
    test('user with too short password can not be added', async () => {
      const usersInDatabase = await usersInDb()
      await api
        .post('/api/users')
        .send({
          name: 'uusi',
          username: 'uusinimi',
          password: 'uu',
          adult: false
        })
        .expect(400)
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersInDatabase.length)
    })
    test('user with username taken can not be added', async () => {
      const usersInDatabase = await usersInDb()
      await api
        .post('/api/users')
        .send({
          name: 'uusi',
          username: 'jlongi',
          password: 'uusi',
          adult: false
        })
        .expect(400)
      const usersAfterOperation = await usersInDb()
      expect(usersAfterOperation.length).toBe(usersInDatabase.length)
    })
    test('user adult is defaulted to true', async () => {
      const response = await api
        .post('/api/users')
        .send({
          name: 'uusi',
          username: 'uusi',
          password: 'uusi'
        })
        .expect(200)
      expect(response.body.adult).toBe(true)
    })
  })
})

afterAll(() => {
  server.close()
})
