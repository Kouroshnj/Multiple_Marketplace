const { ethers } = require('hardhat');
const connector = require('../utils/connect');

async function Items() {
    const contract = await connector();
    const data = await contract.BoughtItems();
    console.log(data);
}
Items();