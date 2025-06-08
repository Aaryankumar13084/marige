
const mongoose = require('mongoose')

const advocate = new mongoose.Schema({
    name: String,
    district: String,
    phone: String,
    courtAddress: String,
    password: String
})

module.exports = mongoose.model('advocate', advocate)
