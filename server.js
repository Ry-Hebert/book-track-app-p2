require('dotenv').config()

const Express = require('express')
const Mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Books = require('./models/books')

const server = new Express()

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(Express.json())
server.use(Express.urlencoded())
server.use('/', Express.static('./public'))

Mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

server.listen(process.env.PORT || 3001, () =>{
    console.log('Server is running now')
})

server.get('/books', (req, res) => {
    Books.find({}, (err, books) =>{

        if(err){console.log(handleError(err))}
        res.json(books)
    })
})

server.get('/books/:id', (req, res) => {
    Books.find({}, (err, books) =>{

        if(err){console.log(handleError(err))}
        res.json(books)
    })
})

server.post('/books', (req, res) => {
    Books.create({
    key: req.body.key,
    image: req.body.image,
    title:  req.body.title,
    read: req.body.read,
    ratting: req.body.ratting
    })
    res.send('Successfully added element')
})

server.put('/books/:id', (req, res) =>{
    Books.findOne({key: req.params.id}, (err, book) =>{
        if(err){console.log(handleError(err))}
        console.log(book)
        console.log(req.body)
        book.update(req.body, (err) =>{
            // if(err){console.log(handleError(err))}
            Books.find({}, (err, bookX) =>{
                if(err){console.log(handleError(err))}
                res.json(bookX)
            })
        })
    })
})

server.delete('/books/:id', (req, res) =>{
    console.log(req.params.id)
    Books.remove({key: req.params.id}, (err) => {
        if(err){console.log(handleError(err))}
        Books.find((err, book) =>{
            if(err){console.log(handleError(err))}
            res.json(book)
        })
    })
})