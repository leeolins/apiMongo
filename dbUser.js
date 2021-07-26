const mongoose = require('mongoose')

const User = new mongoose.Schema({
    name: String,
    password: String,
    emailOwner: String
})

module.exports = User