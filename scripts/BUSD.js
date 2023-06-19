const { BUSD } = require('../data/addresses.json');
const { ethers } = require('hardhat');

const BUSD_abi = require('../artifacts/contracts/utils/BUSD.sol/BUSD.json').abi;

async function mint() {
    const [deployer, addr1] = await ethers.getSigners();
    var contract = new ethers.Contract(BUSD, BUSD_abi, addr1.provider);
    const set = await contract.connect(addr1).mint(addr1.address)
    console.log(set);
}
mint();