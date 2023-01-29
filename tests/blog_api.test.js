const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeAll(async () => {
  await Blog.deleteMany()
  await Blog.insertMany(helper.initialBlogs)
})

describe('GET checks', () => {
  test('blogs are returned as json and have correct amount of posts', async () => {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 100000)
})

describe('ID check', () => {
  test('verifying the identificator called id, not _id', async() => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  }, 100000)
})

describe('POST checks', () => {
  test('posting correct blog', async () => {
    const newBlog = {
      title: 'KNU SHEVCHENKO',
      author: 'Taras Shevcenko',
      url: 'knu.ua',
      likes: 122
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(r => r.title)
    expect(contents).toContain(newBlog.title)
  }, 1000000)

  test('checking empty likes field in the blog', async () => {
    const newBlog = {
      title: 'microsoft learn',
      author: 'microsoft',
      url: 'learn.microsoft.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 2)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => [r.title, r.likes])

    expect(contents).toContainEqual(
      [newBlog.title, 0]
    )
  }, 1000000)

  test('checking empty title field in the blog', async () => {
    const newBlog = {
      author: 'googleBlog',
      url: 'google.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 2)
  }, 1000000)

  test('checking empty url field in the blog', async () => {
    const newBlog = {
      title: 'Node.js Blog',
      author: 'Bacancy'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length + 2)
  }, 1000000)
})

describe('DELETE check', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  }, 1000000)
})

describe('UPDATE check', () => {

  test('Updating post', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 6
    }

    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate= blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)


    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const contents = blogsAtEnd.map(r => [r.title, r.likes])

    expect(contents).toContainEqual([newBlog.title, newBlog.likes])
  }, 1000000)
})

afterAll(async () => {
  await mongoose.connection.close()
})
