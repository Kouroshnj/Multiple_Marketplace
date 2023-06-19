const { ethers } = require('hardhat');
const connector = require('../utils/connect');
const { Land } = require('../data/addresses.json');
const { Segment } = require('../data/addresses.json');
const { BUSD } = require('../data/addresses.json');
const abi_721 = require('../artifacts/contracts/utils/Land.sol/Land.json').abi;
const abi_BUSD = require('../artifacts/contracts/utils/BUSD.sol/BUSD.json').abi;
const abi_1155 = require('../artifacts/contracts/utils/segment.sol/segment.json').abi;
const marketplace = require('../data/address_this.json')

async function getOwner() {
    const [signer, addr1] = await ethers.getSigners()
    const contract = new ethers.Contract(Land, abi_721, addr1.provider)
    const owner = await contract.ownerOf("2")
    console.log(owner);
}
getOwner()

async function getOwner_Segment() {
    const [signer, addr1] = await ethers.getSigners();
    const contract = new ethers.Contract(Segment, abi_1155, addr1.provider);
    // var address =
    const balance = await contract.balanceOf(addr1.address, "1");
    console.log("Segment balance is", balance);
}
getOwner_Segment();

async function balance_BUSD() {
    const [signer, addr1] = await ethers.getSigners();
    const contract = new ethers.Contract(BUSD, abi_BUSD, addr1.provider);
    const balance = await contract.balanceOf(marketplace);
    console.log(balance);
}
balance_BUSD();

async function balanceContract() {
    const [signer, addr1] = await ethers.getSigners();
    const contract = connector();
    const balance = await ethers.provider.getBalance(marketplace);
    console.log(balance);
}
balanceContract();

