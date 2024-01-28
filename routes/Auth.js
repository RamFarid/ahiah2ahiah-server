const express = require('express')
const responseMessage = require('../utils/responseMessage')
const authRouter = express.Router()

authRouter.post('/login', async (req, res) => {
  const password = req.body.password.trim()
  if (!password) return res.json(responseMessage('فين الباسورد؟', false))

  if (process.env.CLIENT_PASSWORD !== password) {
    res.status(403).json(responseMessage('انت شكلك مش خادم!', false))
    return
  }
  res.json(responseMessage('أهلا.', true, { data: password }))
})

authRouter.get('/check', async (req, res) => {
  try {
    const password = req.header('Authorization')
    if (!password)
      return res.status(401).json(responseMessage('الباسورد مطلوب', false))

    if (process.env.CLIENT_PASSWORD !== password) {
      res.status(403).json(responseMessage('انت شكلك مش خادم!', false))
      return
    }
    res.status(200).json(
      responseMessage('User auth success.', true, {
        password,
      })
    )
  } catch (error) {
    res.status(500).json({ message: error.message, success: false })
  }
})

module.exports = authRouter
