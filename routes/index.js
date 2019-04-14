const express = require('express');
var path = require('path');
const router = express.Router();
const user = require('../model/user');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index',{title:'Helping Blocks'});
});

router.post('/register',function (req,res) {
    new user({
        email: req.body.email,
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
    user.findOne({email:req.body.email},function(err,user) {
        if (err)
            return res.status(500).send({message: 'Server Error'});

        else if(!user)
            return res.status(404).send({message:'User not found'});

        else
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
        user.updateOne({email:req.session.user.email},{$push: { donations: req.body.id}},function (err,user) {
            if (err)
                return res.status(500).send({message: 'Server Error'});

            else return res.status(200).send({message: 'Donation id is saved'});

        });
    else return res.status(401).send({message:'Login first'});
});

router.get('/donation',function(req,res){
    if(req.session.user)
        user.findOne({email:req.session.user.email},function(err,user) {
            if (err)
                return res.status(500).send({message: 'Server Error'});

            else return res.status(200).send({donation_ids: user.donations});

        });

    else return res.status(401).send({message:'Login first'});
});


router.get('/dashboard',function(req,res){
    res.sendFile(path.join(__dirname, '../views/dashboard.html'));
    
})

router.get('/staff',function(req,res){
    res.sendFile(path.join(__dirname, '../views/staff.html'));
   
})

router.get('/maps',function(req,res){
    res.sendFile(path.join(__dirname, '../views/maps.html'));
    
})

router.get('/finances',function(req,res){
    res.sendFile(path.join(__dirname, '../views/finances.html'));
    
})

router.get('/donations',function(req,res){
    res.sendFile(path.join(__dirname, '../views/donations.html'));
      
})


module.exports = router;