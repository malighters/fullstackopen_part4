/* eslint-disable no-prototype-builtins */
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  return blogs.reduce((counter, value) => counter + value.likes, 0)
}

const favoriteBlog = (blogs) => {
  const max = blogs.reduce((previous, current) => ( (previous.likes > current.likes) ? previous : current),0)
  return {
    title:max.title,
    author: max.author,
    likes: max.likes
  }
}

const mostBlogs = (blogs) => {
  let authors = new Object()
  blogs.forEach((blog) => {authors.hasOwnProperty(blog.author) ? authors[blog.author] +=1 : authors[blog.author] = 1})
  const maxBlogs = Object.entries(authors).reduce((previous, current) => ( (previous[1] > current[1]) ? previous : current),0)
  return {
    author: maxBlogs[0],
    blogs: maxBlogs[1]
  }
}

const mostLikes = (blogs) => {
  let authors = new Object()
  blogs.forEach((blog) => {authors.hasOwnProperty(blog.author) ? authors[blog.author] += blog.likes : authors[blog.author] = blog.likes})
  const maxLikes = Object.entries(authors).reduce((previous, current) => ( (previous[1] > current[1]) ? previous : current),0)
  return {
    author: maxLikes[0],
    likes: maxLikes[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}