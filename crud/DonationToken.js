contracts = require('../Contracts.js');
Transaction = require('ethereumjs-tx')
ethereumjs = require('ethereumjs')
const superAgent = require('superagent');
const baseUrl = "https://helpingblocks-vault.tk:8200/v1/";
const Header = {'Content-Type':'application/json','Authorization':'Bearer s.0sBXyr3nwRMwUXgPBBMAL78p' };

tx = contracts.DonationToken.methods.createDonation('Usama', 1000, '3647217483462');//.send({from: "0x3Def02f7c8e6130b8A28aeA3E0fECF6C9a14aBe8"})

encoded_tx = tx.encodeABI();
let transactionObject = {
    data: encoded_tx,
    from: '0x3def02f7c8e6130b8a28aea3e0fecf6c9a14abe8',
    to: contracts.DonationToken.address,
    gas_limit: 5300000,
    gas_price: 1000000000000
};
tx = new Transaction(transactionObject);
tx.sign(Buffer.from("1bb14798005f8e06c8c141f00b12a74d0f11dc4ae786ca0fbb4738ed100bf0b3", 'hex'))
var raw = '0x' + tx.serialize().toString('hex');
web3.eth.`sendRawTransaction`(raw, function (err, transactionHash) {
      console.log(transactionHash);
    });
rawTx = JSON.stringify(transactionObject);
var signedTransactionObject;
var signedTransaction;
var rx;
var results;
superAgent.post(baseUrl+'ethereum/accounts/admin/sign-tx')
    .set(Header)
    .send(rawTx)
    .then(result => { 
        // signedTransactionObject = result.body.data;
        // signedTransactionObject.gas= 53000;
        // signedTransactionObject.gas_limit= 300000;
        // signedTransactionObject.gas_price= 0;

        // signedTransaction = new Transaction(result.body.data.signed_transaction);
        // rx = '0x' + signedTransaction.serialize().toString('hex');
        contracts.web3.eth.sendSignedTransaction(result.body.data.signed_transaction).on('receipt', function (receipt) {
                results = receipt;
                console.log(results);
         }).catch(console.error)
    })
    .catch(console.error);
// function signTransaction(contractAdr, tx, from){

//     let encoded_tx = tx.encodeABI();
//     let transactionObject = {
//         gas: 0,
//         data: encoded_tx,
//         from: '0xddd61c92d24b1588fea597b515cd75e24afd6b00',
//         to: contracts.DonationToken.address
//     };
//     rawTx = JSON.stringify(transactionObject);



// }
// module.exports = {
//     this.createDonation(){

//         let tx_builder = contractInstance.methods.myMethod(arg1, arg2, ...);
//         signedTransaction = signTransaction(tx_builder)
//         web3g.eth.sendSignedTransaction(signedTransaction)
//         .on('receipt', function (receipt) {
//                 //do something
//          });
//     }
// } 