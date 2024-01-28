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
})

module.exports = mongoose.model('persons', PersonSchema)
