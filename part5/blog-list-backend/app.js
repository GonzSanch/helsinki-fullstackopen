const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controller/blogs')
const usersRouter = require('./controller/users')
const loginRouter = require('./controller/login')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

const connectToDb = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
        logger.info('connected to MongoDB')
    } catch (exception) {
        logger.error('error connecting to MongoDB: ', exception)
    }
}

connectToDb()

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controller/testing')
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app