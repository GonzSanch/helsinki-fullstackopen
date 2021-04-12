const _ = require('lodash')

const dummy = (blogs) => {
    if (blogs)
        return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce(( sum, { likes }) => sum + likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.length === 0
        ? null
        : blogs.reduce((fav, blog) => fav = fav.likes > blog.likes ? fav : blog)
}

const mostBlogs = (blogs) => {
    const authors = blogs.map(blog => blog.author)
    const result = _(authors).groupBy('author').values().map(group =>
        ({ ...group[0], blogs: group.length })).head()

    return blogs.length === 0
        ? null
        : result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}