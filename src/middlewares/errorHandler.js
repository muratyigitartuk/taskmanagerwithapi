function notFoundHandler(req, res, next) {
  res.status(404).json({ error: { message: 'Route not found' } })
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500
  let message = err.message || 'Internal Server Error'

  if (err.name === 'CastError') {
    return res.status(400).json({ error: { message: 'Invalid ID format' } })
  }
  if (err.name === 'ValidationError') {
    const details = Object.keys(err.errors).map((k) => ({ param: k, msg: err.errors[k].message }))
    return res.status(422).json({ error: { message: 'Model validation failed', details } })
  }
  if (err.array && typeof err.array === 'function') {
    const details = err.array()
    return res.status(422).json({ error: { message: 'Validation failed', details } })
  }

  res.status(status).json({ error: { message } })
}

module.exports = { notFoundHandler, errorHandler }
