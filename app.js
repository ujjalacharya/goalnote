const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3000;
const bodyParser = require('body-parser')

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
            .then(data =>res.redirect('/ideas'))
    }
})


app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})