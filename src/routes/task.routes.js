const express = require('express')
const Task = require('../models/task.model')
const { body, param } = require('express-validator')
const { runValidation } = require('../middlewares/validate')
const { requireDb } = require('../middlewares/requireDb')

const router = express.Router()

router.use(requireDb)

const idParam = param('id').isMongoId().withMessage('Invalid task ID')

const createValidators = [
  body('title').isString().trim().notEmpty().withMessage('title is required'),
  body('description').optional().isString().trim(),
  body('completed').optional().isBoolean().withMessage('completed must be boolean').toBoolean(),
  body('dueDate').optional().isISO8601().toDate()
]

const updateValidators = [
  body('title').optional().isString().trim().notEmpty(),
  body('description').optional().isString().trim(),
  body('completed').optional().isBoolean().toBoolean(),
  body('dueDate').optional().isISO8601().toDate()
]

router.post('/', createValidators, runValidation, async (req, res, next) => {
  try {
    const task = await Task.create(req.body)
    res.status(201).json({ data: task })
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.json({ data: tasks })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', idParam, runValidation, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ error: { message: 'Task not found' } })
    res.json({ data: task })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', idParam, updateValidators, runValidation, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!task) return res.status(404).json({ error: { message: 'Task not found' } })
    res.json({ data: task })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', idParam, runValidation, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ error: { message: 'Task not found' } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
