const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tmrapi'

async function connectDB() {
  mongoose.set('strictQuery', true)
  await mongoose.connect(MONGODB_URI)
  console.log('MongoDB connected')
}

function isConnected() {
  return mongoose.connection.readyState === 1
}

module.exports = { connectDB, isConnected }
