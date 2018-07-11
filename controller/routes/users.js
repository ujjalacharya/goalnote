const router = require('express').Router();
const mongoose = require('mongoose');
const Idea = require('../../models/Idea');

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', (req, res) => {
    const errors = [];
    if (!req.body.name) {
        errors.push({ text: 'Empty name' })
    }
    if (!req.body.email) {
        errors.push({ text: 'Empty email' })
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Password too short' })
    }
    if (req.body.password !== req.body.password2) {
        errors.push({ text: 'Passwords do not match' })
    }
    
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            password: req.body.password,
            password2: req.body.password2,
            email: req.body.email
        })
    }
    else {
        res.send('Successfully registered!')
    }

})

module.exports = router;