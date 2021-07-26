const mongoose = require('mongoose')

const Curso = new mongoose.Schema({
    name: String,
    amount: Number,
    emailOwner: String,
    CreatedDate: { type: Date, default: Date.now }
})

module.exports = Curso