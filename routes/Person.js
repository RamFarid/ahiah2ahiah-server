const express = require('express')
const personRouter = express.Router()
const Person = require('../models/Person')
const responseMessage = require('../utils/responseMessage')

personRouter.put('/:id', async (res, req) => {
  try {
    const { id } = res.params
    const { name, points, grade, gender } = res.body
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      {
        name,
        points,
        grade,
        gender,
      },
      { new: true }
    )
    req
      .status(200)
      .json(
        responseMessage(`تم تحديث ${name} بنجاح`, true, { data: updatedPerson })
      )
  } catch (error) {
    req.status(500).json(responseMessage(error.message, false))
  }
})

personRouter.delete('/:id', async (res, req) => {
  try {
    const { id } = res.params
    const deletedPerson = await Person.findByIdAndDelete(id).exec()
    req
      .status(200)
      .json(responseMessage(`تم مسح ${deletedPerson.name} بنجاح`, true))
  } catch (error) {
    req.status(500).json(responseMessage(error.message, false))
  }
})

personRouter.post('/new', async (res, req) => {
  try {
    const { name, points, grade, gender } = res.body
    const NewPerson = new Person({ name, points, grade, gender })
    await NewPerson.save()
    req
      .status(201)
      .json(
        responseMessage(`تم انشاء ${name} بنجاح`, true, { data: NewPerson })
      )
  } catch (error) {
    req
      .status(500)
      .json(responseMessage(`Somthing wrong happened! ${error.message}`, false))
  }
})

personRouter.get('/', async (req, res) => {
  try {
    const users = await Person.find()
      .select('-quizzes')
      .sort({ points: -1 })
      .lean()
    res
      .status(200)
      .json(responseMessage('200 جبت البيانات بنجاح', true, { data: users }))
  } catch (error) {
    res.status(500).json(responseMessage(error.message, false, { code: 500 }))
  }
})

personRouter.get('/admin', async (_req, res) => {
  try {
    const users = await Person.find().sort({ name: 1 }).lean()
    res
      .status(200)
      .json(responseMessage('200 جبت البيانات بنجاح', true, { data: users }))
  } catch (error) {
    res.status(500).json(responseMessage(error.message, false, { code: 500 }))
  }
})

personRouter.get('/search', async (req, res) => {
  const { q } = req.params
  try {
    const regex = new RegExp(q, 'i')
    const persons = await Person.find({ name: regex }).lean()
    res.json(responseMessage('DN', true, { data: persons }))
  } catch (error) {
    res.status(500).json(responseMessage(error.message, false))
  }
})

module.exports = personRouter
