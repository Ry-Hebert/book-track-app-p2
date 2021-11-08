const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const todosSchema = new Schema({
    id: Number,
    taskName: String,
    completed: Boolean,
    category: String
})

module.exports = Mongoose.model('Todos', todosSchema)
