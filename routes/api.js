const express = require('express');
const router = express.Router();
const donor = require('../model/donor');
const jwt = require('jsonwebtoken');
const user_middleware = require('../middleware/user');
// const contracts = require('../Contracts');

router.get('/testToken',user_middleware.api_auth,function(req,res){
    return res.status(200).send({message:'success'});
});


router.post('/register',function (req,res) {
    new donor({
        CNIC: req.body.CNIC,
        password: req.body.password,
        name:req.body.name
    }).save(function(err, savedUser) {
        if (err) {
            console.log(err);
            return res.status(500).send({message: 'error'});
        }
        return res.status(200).send({message: 'success'});
    });
});

router.post('/donor/login',function (req,res) {
    donor.findOne({CNIC:req.body.CNIC},function(err,user) {
        if (err)
            return res.status(500).send({message: 'server error'});

        else if(!user)
            return res.status(404).send({message:'user not found'});

        else
        // test a password with stored hash
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch) {
                    const token = jwt.sign({
                        Donor:user,
                    },process.env.PWD,{
                        expiresIn: "1h"
                    });
                    return res.status(200).send({message: "success",token:token});
                }

                else return res.status(401).send({message:'incorrect password'});
            });
    })
});

router.get('/track',user_middleware.api_auth,function(req,res){

    // contracts.DonationToken.methods.donations(0).call()
    //     .then(result => {
    //         return res.status(200).send({message: 'success', result: JSON.stringify(result)});
    //     }).catch(error => {
    //     return res.status(500).send({message: 'error'});
    // })
});


router.post('/donation',user_middleware.api_auth,function (req,res) {
    donor.update({CNIC:req.UserData.Donor.CNIC},{$push:
            {donations:{
                    id:req.body.id,
                    amount:req.body.amount,
                    timestamp:req.body.timestamp,
                }
            }
    },function(err) {
        if (err) {
            console.log(err);
            return res.status(500).send({message: 'error'});
        }
        return res.status(200).send({message: 'success'});
    });
});

router.get('/donation',user_middleware.api_auth,function(req,res){

    donor.findOne({CNIC:req.UserData.Donor.CNIC},function(err,user) {
        if (err)
            return res.status(500).send({message: 'server error'});

        else if(!user)
            return res.status(404).send({message:'user not found'});

        else
            return res.status(200).send({message:'success', donations: user.donations});
    });

    //     [
    //     {id:"242341",date:"Monday, Apr 23, 2019",amount:45},
    //     {id:"337567",date:"Tuesday, Feb 18, 2019",amount:2638},
    //     {id:"4324",date:"Friday, May 12, 2019",amount:863},
    //     {id:"312",date:"Wednesday, July 2, 2019",amount:3754},
    //     {id:"4234244",date:"Thursday, June 9, 2019",amount:43},
    //     {id:"65",date:"Sunday, Sept 16, 2019",amount:454978},
    //     {id:"26545632",date:"Friday, Oct 1, 2019",amount:79449},
    //     {id:"346563665",date:"Saturday, Dec 5, 2019",amount:46236}
    // ]
});

router.get('/donation/:id',function(req,res){

    // return res.status(200).send({message: 'success',
    //     result:req.UserData.Donor.donations.id(req.params.id)
    // });
    var contracts = require('../Contracts');
    let donation;
    let amount;
    let unused_amount;
    let sent_donations = [];
    contracts.DonationToken.methods.donations(req.params.id).call().then(function(r){
        // return ;
        amount = contracts.web3.utils.hexToNumber(r.amount);
        unused_amount = contracts.web3.utils.hexToNumber(r.unused_amount);
        // return res.status(200).json(amount);
        donation = {
            CNIC: r.CNIC.substr(0,5) + '-*******-' + r.CNIC.substr(12,13),
            total_amount: amount,
            unused_amount: unused_amount  
        };
        // return res.status(200).json(unused_amount < amount);
        if(unused_amount < amount){
            contracts.DonationToken.methods.sentDonations(req.params.id,0).call().then(function(r){
                var sent_donation = {amount: contracts.web3.utils.hexToNumber(r.amount)};
                console.log(r);
                contracts.DonationManager.methods.getRecipientByAddress(r.recipient).call().then(r=>{
                    let user_id = contracts.web3.utils.hexToNumber(r);
                        contracts.DonationManager.methods.recipients(user_id).call().then(r=>{
                            // return res.status(200).json(r);
                            sent_donation.name = r.name;
                            sent_donation.cnic =  r.cnic.substr(0,5) + '-*******-' + r.cnic.substr(12,13);
                            sent_donations.push(sent_donation);
                            return res.status(200).json({
                                message: "success",
                                data: {
                                    donation,
                                    sent_donations
                                }
                            });

                        })
                })
            }).catch(console.error)
        }else{
            return res.status(200).json({
                message: "success",
                data: {
                    donation,
                    sent_donations
                }
            });
        }
    }).catch(console.error)

    //     _id:"648723",
    //         amount:5765667,
    //     timestamp:1555597802,
    //     signer:{id:"0x56567af4", name:"Umer"},

});

router.post('/shopkeeper/login',user_middleware.login,function (req,res) {
    if (req.middleware.error)
        return res.status(500).send({error: req.middleware.error});

    else {
        const token = jwt.sign({
            userId: req.body.CNIC,
            client_token: req.middleware.message.client_token
        }, process.env.PWD, {
            expiresIn: "1h"
        });
        return res.status(200).send({message: "Auth Successful", token: token});
    }
});

router.post('/pay',user_middleware.api_auth,function (req,res) {
    //Todo: Add transaction to parity using web3

    // user.updateOne({CNIC:req.UserData.CNIC},{$push: { donations: req.body.id}},function (err,user) {
    //     if (err)
    //         return res.status(500).send({message: 'Server Error'});
    //
    //     else return res.status(200).send({message: 'Donation id is saved'});
    // });

    return res.status(200).send({message: 'success'});
});

router.post('/transaction',user_middleware.api_auth,function (req,res) {
    //Todo: Add transaction to parity using web3

    // user.updateOne({CNIC:req.UserData.CNIC},{$push: { donations: req.body.id}},function (err,user) {
    //     if (err)
    //         return res.status(500).send({message: 'Server Error'});
    //
    //     else return res.status(200).send({message: 'Donation id is saved'});
    // });

    return res.status(200).send({message: 'success',transaction_id:"47547546"});
});

router.get('/transaction',user_middleware.api_auth,function(req,res){
    //Todo: Retrieve donations from parity using web3

    // user.findOne({_id:req.UserData.userId},function(err,user) {
    //     if (err)
    //         return res.status(500).send({message: 'Server Error'});
    //
    //     else return res.status(200).send({donation_ids: user.donations});
    //
    // });

    return res.status(200).send({message:'success', transactions: [
            {id:"242341",date:"Monday, Apr 23, 2019",amount:45,recipient:"Zain Bashir"},
            {id:"337567",date:"Tuesday, Feb 18, 2019",amount:2638,recipient:"Hamid bajwa"},
            {id:"4324",date:"Friday, May 12, 2019",amount:863,recipient:"Hussain juneja"},
            {id:"312",date:"Wednesday, July 2, 2019",amount:3754,recipient:"Kamal bengali"},
            {id:"4234244",date:"Thursday, June 9, 2019",amount:43,recipient:"Arshad chucha"},
            {id:"65",date:"Sunday, Sept 16, 2019",amount:454978,recipient:"Sana mirza"},
            {id:"26545632",date:"Friday, Oct 1, 2019",amount:79449,recipient:"Begum nawazish mir"},
            {id:"346563665",date:"Saturday, Dec 5, 2019",amount:46236,recipient:"Rao murshid"}
        ]});
});

router.get('/transaction/:id',user_middleware.api_auth,function(req,res){
    //Todo: Retrieve donations from parity using web3

    // user.findOne({_id:req.UserData.userId},function(err,user) {
    //     if (err)
    //         return res.status(500).send({message: 'Server Error'});
    //
    //     else return res.status(200).send({donation_ids: user.donations});
    //
    // });

    return res.status(200).send({message: 'success',
        result:{
            CNIC:"4257193004533",
            name:"Tanveer Khan",
            amount:5765667,
            timestamp:1555597802,
            signer:{id:0x56567af4, name:"Umer "},
            items_bought:["Daal","Sugar","Tomatoes","Onions","Milk"]
        }});
});

router.post('/receivable',user_middleware.api_auth,function (req,res) {
    //Todo: Confirm Payment received to parity using web3

    // user.updateOne({CNIC:req.UserData.CNIC},{$push: { donations: req.body.id}},function (err,user) {
    //     if (err)
    //         return res.status(500).send({message: 'Server Error'});
    //
    //     else return res.status(200).send({message: 'Donation id is saved'});
    // });

    return res.status(200).send({message: 'success', transactions: [
            {id:"2441",date:"Monday, Apr 23, 2019",amount:45},
            {id:"3567",date:"Tuesday, Feb 18, 2019",amount:2638},
            {id:"4324",date:"Friday, May 12, 2019",amount:863},
            {id:"42344",date:"Thursday, June 9, 2019",amount:43},
            {id:"6575",date:"Sunday, Sept 16, 2019",amount:454978},
            {id:"25632",date:"Friday, Oct 1, 2019",amount:79449},
            {id:"3456",date:"Saturday, Dec 5, 2019",amount:46236}
        ]});
});

router.get('/receivable',user_middleware.api_auth,function(req,res){
    //Todo: Retrieve donations from parity using web3

    // user.findOne({_id:req.UserData.userId},function(err,user) {
    //     if (err)
    //         return res.status(500).send({message: 'Server Error'});
    //
    //     else return res.status(200).send({donation_ids: user.donations});
    //
    // });

    return res.status(200).send({message:'success', transactions: [
            {id:"2441",date:"Monday, Apr 23, 2019",amount:45},
            {id:"3567",date:"Tuesday, Feb 18, 2019",amount:2638},
            {id:"4324",date:"Friday, May 12, 2019",amount:863},
            {id:"31275",date:"Wednesday, July 2, 2019",amount:3754},
            {id:"42344",date:"Thursday, June 9, 2019",amount:43},
            {id:"6575",date:"Sunday, Sept 16, 2019",amount:454978},
            {id:"25632",date:"Friday, Oct 1, 2019",amount:79449},
            {id:"3456",date:"Saturday, Dec 5, 2019",amount:46236}
        ]});
});

module.exports = router;
