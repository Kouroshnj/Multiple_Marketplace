var ethers = require('ethers');
require('dotenv').config({ path: "./config/config.env" });
var provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
var address = '0xa661aaD797c25568e074B3be561d4062386BfFD2';
const abi = require('../artifacts/contracts/Marketplace.sol/Marketplace.json').abi;
// console.log(ethers);
// var wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
var contract = new ethers.Contract(address, abi, provider);
var amount = "87000000000000"
const value = contract.owner()
value.then(res => {
    console.log(res);
})
