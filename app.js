const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')
const customerRouter = require('./controllers/customer')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const workspaceRouter = require('./controllers/workspace')
const setupWorkspaceRouter = require('./controllers/setupWorkspace')
const path = require('path');

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB', { useNewUrlParser: true })
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('',customerRouter)
app.use('/api/workspace',workspaceRouter)
app.use('/api/workspace',setupWorkspaceRouter)
app.use(express.static(path.join(__dirname, 'static')));
//app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app