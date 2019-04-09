const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const {ensureGuest} = require('../../helpers/auth');

router.get('/login', ensureGuest, (req, res) => {
    if( req.query.origin )
        req.session.returnTo = req.query.origin
    else
        req.session.returnTo = req.header('Referer')

    res.render('users/login')
})

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register',ensureGuest, (req, res) => {
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
        User.findOne({
            email: req.body.email
        })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'User already exists');
                    res.redirect('/users/register')
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash
                            newUser.save()
                                .then((user) => {
                                    req.flash('success_msg', 'Successfully registered')
                                    res.redirect('/users/login')
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return;
                                })
                        });
                    });

                }
            })

    }

})

router.post('/login',(req, res, next)=>{
    let returnTo = '/'
    if (req.session.returnTo) {
      returnTo = req.session.returnTo
      delete req.session.returnTo
    }
    passport.authenticate('local',
        {
            failureRedirect: '/users/login',
            successRedirect: returnTo,
            failureFlash: true
        })(req, res, next)
    })

router.get('/logout', (req, res)=>{
    req.logout();
    req.flash('success_msg', 'Successfully logged out');
    res.redirect(req.header('Referer') || '/');
    if (req.session.returnTo) {
        delete req.session.returnTo
    }
})
module.exports = router;