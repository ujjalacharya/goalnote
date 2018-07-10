const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3000;
const bodyParser = require('body-parser')


//Connect to the database
mongoose.connect('mongodb://localhost/vidjoid-dev')
    .then(() => {
        console.log('Successfully connected to the database')
    })
    .catch(err => console.log(err))

//Import Model
require('./models/Ideas');
const Idea = mongoose.model('ideas');

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
    if (!req.body.desc) {
        errors.push({ text: 'Please enter the description' })
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            desc: req.body.desc
        })
    } else {
        res.send('OK')
    }
})


app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})