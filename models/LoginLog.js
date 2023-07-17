const mongoose = require('mongoose')
const Schema = mongoose.Schema

const logSchema = new Schema({
    // id  of the user
    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    loginTime: {
        type: Date,
        required: true,
    },
})

module.exports = mongoose.model('loginlog', logSchema)