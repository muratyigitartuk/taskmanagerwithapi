const { Schema, model } = require('mongoose')

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date }
  },
  { timestamps: true }
)

module.exports = model('Task', taskSchema)
