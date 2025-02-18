"use strict";
var express = require('express');
var passport = require('passport');
var router = express.Router();
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
    res.redirect('/dashboard');
});
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err)
            return next(err);
        res.redirect('/');
    });
});
module.exports = router;
