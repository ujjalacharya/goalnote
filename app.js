const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3000;



//Connect to the database
mongoose.connect('mongodb://localhost/vidjoid-dev')
        .then(()=>{
            console.log('Successfully connected to the database')
        })
        .catch(err=>console.log(err))

//Import Model
require('./models/Ideas');
const Idea = mongoose.model('ideas');
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

app.get('/ideas/add', (req, res)=>{
    res.render('ideas/add');
})


app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})