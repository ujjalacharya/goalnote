const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3000;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash');

mongoose.Promise = global.Promise;
//Connect to the database
mongoose.connect('mongodb://localhost/vidjoid-dev')
    .then(() => {
        console.log('Successfully connected to the database')
    })
    .catch(err => console.log(err))

//Import Model
const Idea = require("./models/Idea");

//BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Template engine middleware
const exphbs = require('express-handlebars');

app.engine('handlebars',
    exphbs({ defaultLayout: 'main' })
);

app.set('view engine', 'handlebars');

//Middleware for method-override
app.use(methodOverride('_method'))

//Middlware for session and flash
app.use(session({
    secret: 'ujjals secret',
    resave: false,
    saveUninitialized: true,
}))
app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Route handling
app.get('/', (req, res) => {
    res.render('index');
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
})

app.post('/ideas', (req, res) => {
    const errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please enter the title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'Please enter the description' })
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newDetails = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newDetails)
            .save()
            .then(data =>{
                req.flash('success_msg', 'Video idea has been added')            
                res.redirect('/ideas')
            })
    }
})

app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then((data) => {
            res.render('ideas', {
                data
            })
        })
})

app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then((data) => {
            res.render('ideas/edit', { data })
        })
})

app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(data => {
            data.title = req.body.title,
                data.details = req.body.details
            data.save()
        })
        .then(data => {
            req.flash('success_msg', 'Video idea has been updated')
            res.redirect('/ideas')
        })
})

app.delete('/ideas/:id', (req, res) => {
    Idea.findOneAndRemove({
        _id: req.params.id
    })
        .then(data => {
            req.flash('success_msg', 'Video idea has been deleted')
            res.redirect('/ideas')
        })
})

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})