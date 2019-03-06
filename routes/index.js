const express = require('express');
const router = express.Router();
const user = require('../model/user');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index',{title:'Helping Blocks'});
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
            return res.status(500).send({message: 'error'});
        }
        return res.status(200).send({message: 'User is registered'});
    });
});

router.post('/login',function (req,res,next) {
    user.findOne({username:req.body.username},function(err,user) {
        if (err) {
            console.log(err);
            return res.status(500).send({message: 'error'});
        }
        else if(!user)
            return res.status(404).send({message:'User not found'});

        // test a password with stored hash
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (isMatch) {
                req.session.user = user;
                return res.send({message: "Hello " + user.firstName});
            }

            else return res.status(401).send({message:'incorrect password'});
        });
    })
});

router.get('/dashboard',function(req,res){
    if(!req.session.user)
        return res.status(401).send({message:'Login first'});
    else return res.status(200).send({message:'Welcome to Dashboard'});
});

router.get('/logout',function(req,res){
    req.session.destroy();
    return res.status(200).send({message:'You have been logged out!!'});
});

module.exports = router;
