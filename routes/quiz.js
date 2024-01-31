const express = require('express')
const Quiz = require('../models/Quiz')
const responseMessage = require('../utils/responseMessage')
const Person = require('../models/Person')
const quizRouter = express.Router()

quizRouter.get('/', async (_req, res) => {
  try {
    const quizzes = await Quiz.find()
    res.json(responseMessage('DN', true, { data: quizzes }))
  } catch (error) {
    res.status(500).json(responseMessage(error.message, false, error))
  }
})

quizRouter.get('/active', async (_req, res) => {
  try {
    const activeQuiz = await Quiz.findOne({ active: true })
    res.json(
      responseMessage('DN', true, {
        data: activeQuiz,
        code: activeQuiz ? '' : 'NO_ACTIVE_QUIZ',
      })
    )
  } catch (error) {
    res.status(500).json(responseMessage(error.message, false, error))
  }
})

quizRouter.get('/:quizID/target', async (req, res) => {
  const { quizID } = req.params
  try {
    const targetQuiz = await Quiz.findById(quizID)
    res.json(
      responseMessage('DN', true, {
        data: targetQuiz,
        code: targetQuiz ? '' : 'NO_ACTIVE_QUIZ',
      })
    )
  } catch (error) {
    res.status(500).json(responseMessage(error.message, false, error))
  }
})

quizRouter.put('/:quizID/active', async (req, res) => {
  const {
    body: { currentValue },
    params: { quizID },
  } = req
  try {
    await Quiz.findOneAndUpdate({ active: true }, { active: false })
    const targetQuiz = await Quiz.findOneAndUpdate(
      { _id: quizID },
      { active: !Boolean(currentValue) },
      { new: true }
    )
    res.json(
      responseMessage('DN', true, {
        data: targetQuiz,
        code: targetQuiz ? '' : 'NO_ACTIVE_QUIZ',
      })
    )
  } catch (error) {
    res.status(500).json(responseMessage(error.message, false, error))
  }
})

quizRouter.put('/inactive', async (_req, res) => {
  try {
    const targetQuiz = await Quiz.findOneAndUpdate(
      { active: true },
      { active: false }
    )
    res.json(responseMessage('DN', true, { data: targetQuiz }))
  } catch (error) {
    res.status(500).json(responseMessage(error.message, false, error))
  }
})

quizRouter.post('/:quizID/answer', async (req, res) => {
  const { userID, degree, answers } = req.body
  const { quizID } = req.params
  try {
    const target = await Person.findById(userID).select('quizzes').lean()
    const isSolved = Boolean(
      target.quizzes.find((q) => q.quiz_id.equals(quizID))
    )
    if (isSolved) {
      return res.status(403).json(responseMessage('أنت حليت الكويز ده قبل كده'))
    }
    const targetPerson = await Person.findOneAndUpdate(
      { _id: userID },
      {
        $addToSet: {
          quizzes: { quiz_id: quizID, degree, questions_solve: answers },
        },
      },
      {
        new: true,
      }
    ).lean()
    res.json(responseMessage('DN', true, { data: targetPerson }))
  } catch (error) {
    res.status(500).json(responseMessage(error.message, false, error))
  }
})

module.exports = quizRouter
