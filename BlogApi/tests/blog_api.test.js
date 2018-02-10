const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const  { initialBlogs, blogsInDb, existingBlog } = require('./test_helper_blog')

beforeEach(async () => {
  await Blog.remove({})
  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  await Promise.all(blogObjects.map(blog => blog.save()))
})

describe('Blogs', () => {
  describe('GET', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('all blogs are found', async () => {
      const blogsInDatabase = await blogsInDb()
      const response = await api
        .get('/api/blogs')

      expect(response.body.length).toBe(blogsInDatabase.length)
    })
    test('blogs contain specific blog', async () => {
      const response = await api
        .get('/api/blogs')
      const titles = response.body.map(res => res.title)
      expect(titles).toContain('First class tests')
    })
  })

  describe('POST', () => {
    test('valid blog can be added', async () => {
      const blogsAtStart = await blogsInDb()
      await api
        .post('/api/blogs')
        .send({
          title: 'Joonaksen Blogi',
          author: 'Joonas',
          url: 'www.joonas.com',
          likes: 9999
        })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length + 1)

      const titles = blogsAfterOperation.map(res => res.title)
      expect(titles).toContain('Joonaksen Blogi')
    })
    test('invalid blog can not be added', async () => {
      const blogsAtStart = await blogsInDb()
      await api
        .post('/api/blogs')
        .send({})
        .expect(400)

      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })
    test('blog without title can not be added', async () => {
      const blogsAtStart = await blogsInDb()
      await api
        .post('/api/blogs')
        .send({
          author: 'Joonas',
          url: 'www.joonas.com',
          likes: 9999
        })
        .expect(400)

      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })
    test('blog without url can not be added', async () => {
      const blogsAtStart = await blogsInDb()
      await api
        .post('/api/blogs')
        .send({
          title: 'Joonaksen Blogi',
          author: 'Joonas',
          likes: 9999
        })
        .expect(400)
      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })
    test('blog without likes set, gets 0 likes automatically', async () => {
      const response = await api
        .post('/api/blogs')
        .send({
          title: 'Joonaksen Blogi',
          author: 'Joonas',
          url: 'www.joonas.com'
        })
        .expect(200)

      expect(response.body.likes).toEqual(0)
    })
    test('blog with likes set, gets them automatically', async () => {
      const response = await api
        .post('/api/blogs')
        .send({
          title: 'Joonaksen Blogi',
          author: 'Joonas',
          url: 'www.joonas.com',
          likes: 999
        })
        .expect(200)

      expect(response.body.likes).toEqual(999)
    })
  })

  describe('DELETE', () => {
    test('specific blog can be deleted with valid id', async () => {
      const blog = await existingBlog()
      const blogsAtStart = await blogsInDb()
      await api
        .delete(`/api/blogs/${blog._id.toString()}`)
        .expect(204)

      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length - 1)
    })
    test('specific blog can not be deleted with id', async () => {
      const blogsAtStart = await blogsInDb()
      await api
        .delete('/api/blogs/12345')
        .expect(400)

      const blogsAfterOperation = await blogsInDb()
      expect(blogsAfterOperation.length).toBe(blogsAtStart.length)
    })
  })

  describe('PUT', () => {
    test('valid blog can be updated', async () => {
      const blog = await existingBlog()
      const response = await api
        .put(`/api/blogs/${blog._id.toString()}`)
        .send({
          title: blog.title,
          author: blog.author,
          url: blog.url,
          likes: 99
        })
        .expect(200)

      expect(response.body.likes).toBe(99)
    })
  })
})

afterAll(() => {
  server.close()
})
