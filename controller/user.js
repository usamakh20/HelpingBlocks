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
            return res.status(200).send({message: 'User is registered'});
        })
        .catch(error => {
            return res.status(500).send({error: error});
        });

};


exports.login = ()=>{
    superAgent.post(baseUrl+'')
        .set(Header)
        .send({})
        .then(result => {
            return res.status(200).send({message: "Auth Successful",token:result.auth.client_token});
        })
        .catch(error => {
            return res.status(401).send({message: 'Auth failed'});
        });
};