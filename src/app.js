const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const tasksRouter = require('./routes/task.routes')
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler')
const { isConnected } = require('./config/db')

const app = express()

const corsOrigin = process.env.CORS_ORIGIN || '*'
app.use(cors({ origin: corsOrigin }))
app.use(helmet())
app.use(express.json())

app.use(express.static('public'))

app.get('/health', (req, res) => {
  res.json({ ok: true, dbConnected: isConnected() })
})

app.use('/api/tasks', tasksRouter)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
