const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash');
const ideas = require('./controller/routes/ideas');
const users = require('./controller/routes/users');
const passport = require('passport');
const db = require('./config/db')

mongoose.Promise = global.Promise;
//Connect to the database
mongoose.connect(db.mongoURI)
    .then(() => {
        console.log('Successfully connected to the database')
    })
    .catch(err => console.log(err))

//Middleware for static folder
app.use(express.static(path.join(__dirname, 'public')))

//BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Passport JS
require('./config/passport')(passport);

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

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null
    next();
})

//Route handling
app.get('/', (req, res) => {
    res.render('index');
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.use('/ideas', ideas);
app.use('/users', users);

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})