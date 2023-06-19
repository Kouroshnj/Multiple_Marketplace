const { ethers } = require('hardhat');
const connector = require('../utils/connect');

const abi_BUSD = require('../artifacts/contracts/utils/BUSD.sol/BUSD.json').abi;


async function get() {
    const [signer, addr1] = await ethers.getSigners()
    const contract = await connector()
    const data = await contract.getUserData("1")
    console.log(data);
}
get();