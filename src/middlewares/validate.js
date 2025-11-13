const { validationResult } = require('express-validator')

function runValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ error: { message: 'Validation failed', details: errors.array() } })
  }
  next()
}

module.exports = { runValidation }
