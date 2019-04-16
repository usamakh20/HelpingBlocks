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

router.post('/test',function(req,res){
    console.log(req.body);
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
    res.render('staff',
    {
        table:[
            {ID:"1", name:"oName 1", contact:"oContact 1", email:"oEmail 1", role:"oRole 1", city:"oCity 1"},
            {ID:"2", name:"oName 2", contact:"oContact 2", email:"oEmail 2", role:"oRole 2", city:"oCity 2"},
            {ID:"3", name:"oName 3", contact:"oContact 3", email:"oEmail 3", role:"oRole 3", city:"oCity 3"},
            {ID:"4", name:"oName 4", contact:"oContact 4", email:"oEmail 4", role:"oRole 4", city:"oCity 4"}
        ]
    });
});
router.post('/staff',user_middleware.auth,function(req,res,next){
    console.log(req.body);    
    res.render('staff',
    {
        table:[
            {ID:"1", name:"mName 1", contact:"mContact 1", email:"mEmail 1", role:"mRole 1", city:"mCity 1"},
            {ID:"2", name:"mName 2", contact:"mContact 2", email:"mEmail 2", role:"mRole 2", city:"mCity 2"},
            {ID:"3", name:"mName 3", contact:"mContact 3", email:"mEmail 3", role:"mRole 3", city:"mCity 3"},
            {ID:"4", name:"mName 4", contact:"mContact 4", email:"mEmail 4", role:"mRole 4", city:"mCity 4"}
        ]
    });
});



router.get('/maps',user_middleware.auth,function(req,res){
    res.render('maps');
});


router.get('/finances',user_middleware.auth,function(req,res){
    res.render('finances');
});
router.post('/finances',user_middleware.auth,function(req,res){
    res.redirect('finances');
});



router.get('/donations',user_middleware.auth,function(req,res){
    res.render('donations',
    {
        table:[
            {ID:"1", name:"oName 1", contact:"oContact 1", email:"oEmail 1", city:"oCity 1"},
            {ID:"2", name:"oName 2", contact:"oContact 2", email:"oEmail 2", city:"oCity 2"},
            {ID:"3", name:"oName 3", contact:"oContact 3", email:"oEmail 3", city:"oCity 3"},
            {ID:"4", name:"oName 4", contact:"oContact 4", email:"oEmail 4", city:"oCity 4"}
        ]
    });
});
router.post('/donations',user_middleware.auth,function(req,res){
    res.render('donations',
    {
        table:[
            {ID:"1", name:"mName 1", contact:"mContact 1", email:"mEmail 1", city:"mCity 1"},
            {ID:"2", name:"mName 2", contact:"mContact 2", email:"mEmail 2", city:"mCity 2"},
            {ID:"3", name:"mName 3", contact:"mContact 3", email:"mEmail 3", city:"mCity 3"},
            {ID:"4", name:"mName 4", contact:"mContact 4", email:"mEmail 4", city:"mCity 4"}
        ]
    });
});


router.get('/registration',user_middleware.auth,function(req,res){
    res.render('registration');
      
});
router.post('/registration',user_middleware.auth,function(req,res){
    res.redirect('registration');      
});



router.get('/shopkeeper',user_middleware.auth,function(req,res){
    res.render('shopkeeper');      
});
router.posr('/shopkeeper',user_middleware.auth,function(req,res){
    res.redirect('shopkeeper');      
});

module.exports = router;