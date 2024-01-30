const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema(
  {
    title: String,
    active: Boolean,
    questions: [
      {
        notes: String,
        question: String,
        choices: [
          {
            choice: String,
            correct: Boolean,
          },
        ],
        type: {
          type: String,
          required: true,
          default: 'single',
        },
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

module.exports = mongoose.model('quizzes', QuizSchema)
