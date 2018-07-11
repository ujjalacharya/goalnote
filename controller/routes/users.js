const router = require('express').Router();
const mongoose = require('mongoose');
const Idea = require('../../models/Idea');

router.get('/login', (req, res)=>{
    res.render('users/login')
})

router.get('/register', (req, res)=>{
    res.render('users/register')
})

module.exports = router;