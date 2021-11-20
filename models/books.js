const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const booksSchema = new Schema({
    key: String,
    image: String,
    title: String,
    read: Boolean,
    ratting: Number
})

module.exports = Mongoose.model('Books', booksSchema)
