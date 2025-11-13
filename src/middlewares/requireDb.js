const { isConnected } = require('../config/db')

function requireDb(req, res, next) {
  if (!isConnected()) {
    return res.status(503).json({ error: { message: 'Database not connected' } })
  }
  next()
}

module.exports = { requireDb }
