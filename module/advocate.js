
const mongoose = require('mongoose')

const advocate = new mongoose.Schema({
    name: String,
    password: String
})

module.exports = mongoose.model('advocate', advocate)
