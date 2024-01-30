const mongoose = require('mongoose')

const PersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  grade: {
    type: Number,
  },
  gender: {
    type: Number,
    required: true,
  },
  quizzes: [
    {
      quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'quizzes',
      },
      degree: { type: Number, required: true },
      questions_solve: [
        {
          question_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          answer: {
            type: mongoose.Schema.Types.Mixed,
          },
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
})

module.exports = mongoose.model('persons', PersonSchema)
