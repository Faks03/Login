const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    price: {
        type: String,
        required: true,
    },    
})

module.exports = mongoose.model('productdetails', userSchema)
