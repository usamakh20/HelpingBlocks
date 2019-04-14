const express = require('express');
const router = express.Router();
const user = require('../model/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

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
            return res.status(404).send({message:'User not found'});

        else
        // test a password with stored hash
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch) {
                    const token = jwt.sign({
                        username:user.username,
                        userId:user._id
                    },process.env.PWD,{
                        expiresIn: "1h"
                    });
                    return res.status(200).send({message: "Auth Successful",token:token});
                }

                else return res.status(401).send({message:'incorrect password'});
            });
    })
});

router.get('/dashboard',auth,function(req,res){
    return res.status(200).send({message:'Welcome to Dashboard'});
});


router.post('/donation',auth,function (req,res,next) {
    user.updateOne({_id:req.UserData.userId},{$push: { donations: req.body.id}},function (err,user) {
        if (err)
            return res.status(500).send({message: 'Server Error'});

        else return res.status(200).send({message: 'Donation id is saved'});
    });
});

router.get('/donation',auth,function(req,res){
    user.findOne({_id:req.UserData.userId},function(err,user) {
        if (err)
            return res.status(500).send({message: 'Server Error'});

        else return res.status(200).send({donation_ids: user.donations});

    });
});

module.exports = router;
