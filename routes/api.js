const express = require('express');
const router = express.Router();
const user = require('../model/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const userController = require('../controller/user');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index',{title:'Helping Blocks'});
});

router.post('/register',userController.register,function (req,res) {
    if (req.middleware.error)
        return res.status(500).send({error: req.middleware.error});

    else return res.status(200).send({message: 'User is registered'});
});

router.post('/login',userController.login,function (req,res) {
        if (req.middleware.error)
            return res.status(500).send({error: req.middleware.error});

        else {
            const token = jwt.sign({
                userId: req.body.username,
                client_token: req.middleware.client_token
            }, process.env.PWD, {
                expiresIn: "1h"
            });
            return res.status(200).send({message: "Auth Successful", token: token});
        }
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
