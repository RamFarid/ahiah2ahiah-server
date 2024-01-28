const express = require('express')
const responseMessage = require('../utils/responseMessage')
const Group = require('../models/Group')
const groupsRouter = express.Router()

groupsRouter.get('/', async (res, req) => {
  try {
    const groups = await Group.find().sort({ points: -1 }).exec()
    req.status(200).json(responseMessage('Seccess.', true, { data: groups }))
  } catch (error) {
    req
      .status(500)
      .json(responseMessage(`المشكله مش من عندك ${error.message}`, false))
  }
})

groupsRouter.put('/:id', async (res, req) => {
  try {
    const { id } = res.params
    const { name, points } = res.body
    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      {
        name,
        points,
      },
      { new: true }
    )
    req
      .status(200)
      .json(
        responseMessage(`تم تحديث ${name} بنجاح`, true, { data: updatedGroup })
      )
  } catch (error) {
    req
      .status(500)
      .json(responseMessage(`المشكله مش من عندك ${error.message}`, false))
  }
})

groupsRouter.post('/new', async (res, req) => {
  try {
    const { name, points } = res.body
    const NewGroup = new Group({ name, points })
    await NewGroup.save()
    req
      .status(201)
      .json(responseMessage(`تم انشاء ${name} بنجاح`, true, { data: NewGroup }))
  } catch (error) {
    req
      .status(500)
      .json(responseMessage(`المشكله مش من عندك ${error.message}`, false))
  }
})

groupsRouter.delete('/:id', async (res, req) => {
  try {
    const { id } = res.params
    const deletedGroup = await Group.findByIdAndDelete(id).exec()
    req
      .status(200)
      .json(responseMessage(`تم مسح ${deletedGroup.name} بنجاح`, true))
  } catch (error) {
    req.status(500).json(responseMessage(error.message, false))
  }
})

module.exports = groupsRouter
