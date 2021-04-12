const app = require('./app')
const http = require('http')
const conf = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(conf.PORT, () => {
    logger.info(`Server running on port ${conf.PORT}`)
})