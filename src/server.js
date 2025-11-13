require('dotenv').config()
const app = require('./app')
const { connectDB } = require('./config/db')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})

;(async () => {
  try {
    await connectDB()
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
  }
})()

process.on('SIGINT', async () => {
  await mongoose.disconnect()
  process.exit(0)
})
process.on('SIGTERM', async () => {
  await mongoose.disconnect()
  process.exit(0)
})
