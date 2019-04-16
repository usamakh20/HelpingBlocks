const jwt = require('jsonwebtoken');
const superAgent = require('superagent');
const baseUrl = "https://helpingblocks-vault.tk:8200/v1/";
const Header = {'Content-Type':'application/json','Authorization':'Bearer s.WYKgPlPQ6speT256Y6rCdyC2' };

exports.api_auth = (req,res,next) => {
    try {
        req.UserData = jwt.verify(req.headers.authorization, process.env.PWD);
        console.log(req.UserData);
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'auth failed'
        });
    }
};

exports.auth = (req,res,next) => {
    if(req.session.userData)  next();
    else res.redirect('/');
};

exports.register = (req,res,next) => {
    superAgent.post(baseUrl+'auth/userpass/users/'+req.body.CNIC)
        .set(Header)
        .send({
            username: req.body.CNIC,
            password: req.body.password,
            policy: "username"
        })
        .then(result => {
            req.middleware = {message : result};
            next()
        })
        .catch(error => {
            req.middleware = {error: error};
            next()
        });
};


exports.login = (req,res,next) => {
    superAgent.post(baseUrl+'auth/userpass/login/'+req.body.CNIC)
        .set(Header)
        .send({
            password:req.body.password
        })
        .then(result => {
            req.middleware = {message : result.auth};
            next()
        })
        .catch(error => {
            req.middleware = {error: error.response.body};
            next()
        });
};

exports.registerEthereum = (req,res,next) => {
    superAgent.post(baseUrl+'ethereum/accounts/'+req.body.CNIC)
        .set(Header)
        .send()
        .then(result => {
            req.middleware = {message : result.data};
            next()
        })
        .catch(error => {
            req.middleware = {error: error};
            next()
        });
};


exports.signTX = (req,res,next) => {
    superAgent.post(baseUrl+'ethereum/accounts/'+req.body.CNIC+'sign-tx')
        .set(Header)
        .send({
            amount:req.body.amount,
            to:req.body.to,
            data:req.body.transaction_data
        })
        .then(result => {
            req.middleware = {message : result};
            next()
        })
        .catch(error => {
            req.middleware = {error: error};
            next()
        });
};