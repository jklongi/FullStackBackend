const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((accumulator, current) => accumulator + current.likes, 0)
}

const favoriteBlog = blogs => {
  return blogs.length ? blogs.reduce((accumulator, current) => current.likes > accumulator.likes ? current : accumulator) : null
}

const groupBy = (list, key) => {
  return list.reduce((accumulator, currentValue) => {
    (accumulator[currentValue[key]] = accumulator[currentValue[key]] || []).push(currentValue)
    return accumulator
  }, {})
}

const mostBlogs = blogs => {
  const authors = groupBy(blogs, 'author')
  var mostBlogs = Object.values(authors).reduce((accumulator, currentValue) => {
    return currentValue.length > accumulator.length ? currentValue : accumulator
  })
  return { blogs: mostBlogs.length, author: mostBlogs[0].author }
}

const mostLikes = blogs => {
  const authors = groupBy(blogs, 'author')
  var mostBlogs = Object.values(authors).reduce((accumulator, currentValue) => {
    return totalLikes(currentValue) > totalLikes(accumulator) ? currentValue : accumulator
  })
  return { votes: totalLikes(mostBlogs), author: mostBlogs[0].author }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
