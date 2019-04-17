W3 = require('web3');
// solc = require('solc')
// let fs = require("fs");
web3 = new W3(new W3.providers.HttpProvider('http://18.138.40.149:8540'));
let DonationManagerABI = require('./ABI/DonationManager.js');
let DonationTokenABI = require('./ABI/DonationToken.js');

let DonationManager = new web3.eth.Contract(DonationManagerABI);
let DonationToken = new web3.eth.Contract(DonationTokenABI);
DonationManager.address = ("0x9ad72e94e8a4851aD69b6302b261Ff257A0F3f3d");
DonationToken.address = ("0x41B0dfB10A7D92eeE5AF83285Fda9F6b8acC5693");
// console.log(DonationToken);
// DonationManager.methods.admins(0).call().then(r=>{console.log(r)}).catch(console.error)
// DonationToken.methods.totalDonations().call().then(r=>{console.log(r)})
module.exports = {web3, DonationManager, DonationToken};