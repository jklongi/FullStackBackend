const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username : 1, adult: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try{
    const blog = request.body
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if(!token || !decodedToken.id){
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if(!blog || !blog.title || !blog.author || !blog.url){
      return response.status(400).json({ error: 'incorrect blog format' })
    }

    const user = await User.findById(decodedToken.id)

    const newBlog = new Blog({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes || 0,
      user: user._id
    })

    const savedBlog = await newBlog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(newBlog)

  } catch(exception){
    console.log(exception)
    response.status(500).json({ error: 'something went wrong' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if(!token || !decodedToken.id){
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() === user._id.toString()){
      await blog.remove()
    } else {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    response.status(204).end()
  } catch (exception){
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const blog = request.body
    const updatedBlog = await Blog.findOneAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } catch (exception){
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter
