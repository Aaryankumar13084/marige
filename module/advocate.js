const moongose = require('mongoose')

const advocate=new moongose.Schema({
    name:String,
    password:String
})

module.exports = moongose.model('advocate',advocate)