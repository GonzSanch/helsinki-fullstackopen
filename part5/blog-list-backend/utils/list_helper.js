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
    const getAuthor = (blogs) => {
        return _(blogs).groupBy('author').values().map(group =>
            ({ author:group[0].author, blogs: group.length }))
            .orderBy('blogs', 'desc').head()
    }

    return blogs.length === 0
        ? null
        : getAuthor(blogs)
}

const mostLikes = (blogs) => {
    const getLikes = (blogs) => {
        return _(blogs).groupBy('author')
            .map((group, author) => ({
                author: author,
                likes: _.sumBy(group, 'likes')
            })).orderBy('likes', 'desc').head()
    }
    return blogs.length === 0
        ? null
        : getLikes(blogs)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}