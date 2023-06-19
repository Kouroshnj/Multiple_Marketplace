const { ethers } = require('hardhat');
const connector = require('../utils/connect');

async function AllUsers() {
    const contract = await connector()
    const data = await contract.getAllUsers();
    console.log(data);
}
AllUsers();