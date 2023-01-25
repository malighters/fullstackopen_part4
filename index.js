const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config.js')
const Blog = require('./models/blog.js')
const blogRouter = require('./controllers/blogs.js')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)

const PORT = config.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
