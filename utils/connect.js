// var ethers = require('ethers');
const routhPath = require('../utils/routePath');
const { ethers } = require('hardhat');
const path = require('path');
require('dotenv').config({ path: "./config/config.env" });
// var provider = new ethers.providers.getDefaultProvider()
const abi = require(path.join(routhPath, '../artifacts/contracts/Marketplace.sol/Marketplace.json')).abi;
var address = require("../data/address_this.json");
async function run() {
    const [signer] = await ethers.getSigners()

    // const [signer] = await ethers.getSigners()

    const contract = new ethers.Contract(address, abi, signer.provider);
    // console.log(signer);
    return contract

}
module.exports = run
