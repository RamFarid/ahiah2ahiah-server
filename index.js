require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const personRouter = require('./routes/Person')
const authRouter = require('./routes/Auth')
const groupsRouter = require('./routes/group')
const responseMessage = require('./utils/responseMessage')
const Person = require('./models/Person')
const quizRouter = require('./routes/quiz')
const app = express()

const PORT = process.env.PORT || 5000

const URL = process.env.DB_URL

mongoose
  .connect(URL)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch(console.error)

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://ahiah2ahiah.vercel.app'],
  })
)
app.use(bodyParser.json())
app.use(async (req, res, next) => {
  const regex = /\/quiz\/([^\/]+)\/answer/
  const excludedPaths = [
    '/auth/login',
    '/auth/check',
    '/persons',
    '/persons/search',
    '/groups',
    '/quiz/active',
    '/quiz/addmany',
  ]

  if (excludedPaths.includes(req.path) || regex.test(req.path)) {
    // Skip token verification for excluded paths
    return next()
  }

  const password = req.header('Authorization')

  if (!password || password !== process.env.CLIENT_PASSWORD) {
    return res.status(401).json(responseMessage('أنت مش خادم..', false))
  }

  try {
    next()
  } catch (err) {
    return res.status(403).json(responseMessage(err.message, false))
  }
})

app.use('/persons', personRouter)

app.use('/groups', groupsRouter)

app.use('/auth', authRouter)

app.use('/quiz', quizRouter)

app.put('/qrcode', async (req, res) => {
  const { id } = req.query
  const INC_POINT = 1
  if (!id) return res.status(400).json(responseMessage('فين الID؟', false))
  try {
    const { modifiedCount } = await Person.updateOne(
      { _id: id },
      { $inc: { points: INC_POINT } }
    )
    if (modifiedCount === 0) {
      return res
        .status(404)
        .json(responseMessage('مفيش مخدوم بالاسم ده!', false))
    }
    const updatedPerson = await Person.findById(id)
    res
      .status(200)
      .json(
        responseMessage(``, true, { data: updatedPerson, inc_by: INC_POINT })
      )
  } catch (error) {
    res
      .status(500)
      .json(responseMessage('في حاجه غير متوقعه حصلت' + error.message, false))
  }
})

app.listen(PORT, () => console.log('Server run on port: ', PORT))

module.exports = app
