const router = require('express').Router();
const mongoose = require('mongoose');
const Idea = require('../../models/Idea');


router.get('/add', (req, res) => {
    res.render('ideas/add');
})

router.post('/', (req, res) => {
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

router.get('/', (req, res) => {
    Idea.find({})
        .sort({ date: 'desc' })
        .then((data) => {
            res.render('ideas', {
                data
            })
        })
})

router.get('/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then((data) => {
            res.render('ideas/edit', { data })
        })
})

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
    Idea.findOneAndRemove({
        _id: req.params.id
    })
        .then(data => {
            req.flash('success_msg', 'Video idea has been deleted')
            res.redirect('/ideas')
        })
})

module.exports = router;