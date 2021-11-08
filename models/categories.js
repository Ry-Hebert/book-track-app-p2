const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const categoriesSchema = new Schema({
    category: String
})

module.exports = Mongoose.model('Categories', categoriesSchema)
