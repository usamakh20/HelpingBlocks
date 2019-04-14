const express = require('express');
var path = require('path');
const router = express.Router();
const user = require('../model/user');

/* GET home page. */
router.get('/', function(req, res) {
    if(req.session.user)  res.redirect('/dashboard');
    else res.render('adminLogin');
});

router.post('/register',function (req,res) {
    new user({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }).save(function(err, savedUser) {
        if (err) {
            console.log(err);
            return res.status(500).send({message: 'Server Error'});
        }
        return res.status(200).send({message: 'User is registered'});
    });
});

router.post('/login',function (req,res,next) {
    user.findOne({username:req.body.username},function(err,user) {
        if (err)
            return res.status(500).send({message: 'Server Error'});

        else if(!user)
            return res.redirect('/');

        else
        // test a password with stored hash
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch) {
                    req.session.user = user;
                    res.redirect('/dashboard');
                }

                else res.redirect('/');
            });
    })
});

router.get('/test',function(req,res){
    if(!req.session.user)
        return res.status(401).send({message:'Login first'});
    else return res.status(200).send({message:'Welcome to Dashboard'});
});

router.get('/logout',function(req,res){
    req.session.destroy();
    return res.status(200).send({message:'You have been logged out!!'});
});

router.post('/donation',function (req,res,next) {
    if(req.session.user)
        user.updateOne({username:req.session.user.username},{$push: { donations: req.body.id}},function (err,user) {
            if (err)
                return res.status(500).send({message: 'Server Error'});

            else return res.status(200).send({message: 'Donation id is saved'});

        });
    else return res.status(401).send({message:'Login first'});
});

router.get('/donation',function(req,res){
    if(req.session.user)
        user.findOne({username:req.session.user.username},function(err,user) {
            if (err)
                return res.status(500).send({message: 'Server Error'});

            else return res.status(200).send({donation_ids: user.donations});

        });

    else return res.status(401).send({message:'Login first'});
});


router.get('/dashboard',function(req,res){

    //res.sendFile(path.join(__dirname, '../views/dashboard.html'));
    res.render('dashboard');
});


router.get('/staff',function(req,res){

    res.render('staff');
});


router.get('/maps',function(req,res){
    res.render('maps');

});

router.get('/finances',function(req,res){
    res.render('finances');

});

router.get('/donations',function(req,res){
    res.render('donations');

});

module.exports = router;