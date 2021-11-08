require('dotenv').config()

const Express = require('express')
const Mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Todos = require('./models/todos')
const Categories = require('./models/categories')

const server = new Express()

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(Express.json())
server.use(Express.urlencoded())
server.use('/', Express.static('./public'))

Mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

server.listen(process.env.PORT || 3001, () =>{
    console.log('Server is running now')
})

server.get('/todos', (req, res) => {
    Todos.find({}, (err, todos) =>{

        if(err){console.log(handleError(err))}
        res.json(todos)
    })
})

server.get('/categories', (req, res) => {
    Categories.find({}, (err, categories) =>{

        if(err){console.log(handleError(err))}
        res.json(categories)
    })
})

server.get('/category/:id', (req, res) => {
    Categories.find({}, (err, categories) =>{

        if(err){console.log(handleError(err))}
        res.json(categories)
    })
})

server.post('/todos', (req, res) => {
    Todos.create({
    id: req.body.id,
    taskName: req.body.todo,
    completed:  false,
    category: req.body.category
    })
    res.send('Successfully added element')
})

server.post('/categories', (req, res) => {
    console.log(req.query)
    
    Categories.create({
    category: req.query.category
    })
    res.send('Successfully added element')
})

server.put('/todos/:id', (req, res) =>{
    console.log('hit')
    Todos.findOne({id: req.params.id}, (err, todo) =>{
        if(err){console.log(handleError(err))}
        console.log(todo)
        console.log(req.body)
        todo.update(req.body, (err) =>{
            // if(err){console.log(handleError(err))}
            Todos.find({}, (err, todoX) =>{
                if(err){console.log(handleError(err))}
                res.json(todoX)
            })
        })
    })
})

server.put('/categories/:id', (req, res) =>{
    Categories.findById(req.params.id, (err, category) =>{
        if(err){console.log(handleError(err))}
        category.update(req.query, (err) =>{
            if(err){console.log(handleError(err))}
            Categories.find({}, (err, categoryX) =>{
                if(err){console.log(handleError(err))}
                res.json(categoryX)
            })
        })
    })
})

server.delete('/todos/:id', (req, res) =>{
    Todos.remove({id: req.params.id}, (err) => {
        if(err){console.log(handleError(err))}
        Todos.find((err, todo) =>{
            if(err){console.log(handleError(err))}
            res.json(todo)
        })
    })
})

server.delete('/categories/:id', (req, res) =>{
    Categories.remove({_id: req.params.id}, (err) => {
        if(err){console.log(handleError(err))}
        Categories.find((err, category) =>{
            if(err){console.log(handleError(err))}
            res.json(category)
        })
    })
})