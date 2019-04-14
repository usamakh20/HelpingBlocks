const superAgent = require('superagent');
const baseUrl = "https://helpingblocks-vault.tk:8200/v1/";
const Header = {'Content-Type':'application/json','Authorization':'Bearer s.WYKgPlPQ6speT256Y6rCdyC2' };

exports.register = (req,res,next) => {
    superAgent.post(baseUrl+'auth/userpass/users/'+req.body.usernumber)
        .set(Header)
        .send({
            username: req.body.usernumber,
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
    superAgent.post(baseUrl+'auth/userpass/login/'+req.body.usernumber)
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
    superAgent.post(baseUrl+'ethereum/accounts/'+req.body.usernumber)
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
    superAgent.post(baseUrl+'ethereum/accounts/'+req.body.usernumber+'sign-tx')
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