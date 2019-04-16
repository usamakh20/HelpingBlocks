const express = require('express');
const router = express.Router();
const user = require('../model/donor');
const user_middleware = require('../middleware/user');

// router.post('/register',function (req,res) {
//     new user({
//         username: req.body.username,
//         password: req.body.password,
//         firstName: req.body.firstName,
//         lastName: req.body.lastName
//     }).save(function(err, savedUser) {
//         if (err) {
//             console.log(err);
//             return res.status(500).send({message: 'Server Error'});
//         }
//         return res.status(200).send({message: 'User is registered'});
//     });
// });

router.post('/login',user_middleware.login,function (req,res) {
    if (req.middleware.error) {
        console.log(req.middleware.error);
        return res.redirect('/');
    }

    else {
        req.session.userData = req.middleware;
        return res.redirect('/dashboard');
    }
});

router.get('/test',function(req,res){
    if(!req.session.userData)
        return res.status(401).send({message:'Login first'});
    else return res.status(200).send({message:'Welcome to Dashboard'});
});

router.get('/logout',function(req,res){
    req.session.destroy();
    return res.redirect('/');
});

// router.post('/donation',function (req,res) {
//     if(req.session.userData)
//         user.updateOne({username:req.session.userData.username},{$push: { donations: req.body.id}},function (err,user) {
//             if (err)
//                 return res.status(500).send({message: 'Server Error'});
//
//             else return res.status(200).send({message: 'Donation id is saved'});
//
//         });
//     else return res.status(401).send({message:'Login first'});
// });
//
// router.get('/donation',function(req,res){
//     if(req.session.userData)
//         user.findOne({username:req.session.userData.username},function(err,user) {
//             if (err)
//                 return res.status(500).send({message: 'Server Error'});
//
//             else return res.status(200).send({donation_ids: user.donations});
//
//         });
//
//     else return res.status(401).send({message:'Login first'});
// });

/* GET home page. */
router.get('/', function(req, res) {
    if(req.session.userData)  res.redirect('/dashboard');
    else res.render('adminLogin');
});

router.get('/dashboard',user_middleware.auth,function(req,res){
    res.render('dashboard');
});


router.get('/staff',user_middleware.auth,function(req,res){
    res.render('staff');
});


router.get('/maps',user_middleware.auth,function(req,res){
    res.render('maps');
});

router.get('/finances',user_middleware.auth,function(req,res){
    res.render('finances');
});

router.get('/donations',user_middleware.auth,function(req,res){
    res.render('donations');
});

router.get('/registration',user_middleware.auth,function(req,res){
    res.render('registration');
      
});

router.get('/shopkeeper',user_middleware.auth,function(req,res){
    res.render('shopkeeper');
      
});

module.exports = router;