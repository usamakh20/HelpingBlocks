W3 = require('web3');
// solc = require('solc')
// let fs = require("fs");
web3 = new W3(new W3.providers.HttpProvider('https://ropsten.infura.io/34fdaa92de244be196aad18e32f97bf5'));
// web3 = new W3(new W3.providers.HttpProvider('http://18.138.40.149:8540'));
let DonationManagerABI = require('./ABI/DonationManager.js');
let DonationTokenABI = require('./ABI/DonationToken.js');

let DonationManager = new web3.eth.Contract(DonationManagerABI, "0xcf20d07db3e059fd1f16b005c040a40d16f28189");
let DonationToken = new web3.eth.Contract(DonationTokenABI, "0xf8655c435ed1ba8e9551165be43bc4745361199e");
// console.log(DonationToken);
// DonationManager.methods.admins(0).call().then(r=>{console.log(r)}).catch(console.error)
// DonationToken.methods.totalDonations().call().then(r=>{console.log(r)})
module.exports = {web3, DonationManager, DonationToken};