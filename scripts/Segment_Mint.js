const { Segment } = require('../data/addresses.json');
const { ethers } = require('hardhat');
const abi_1155 = require('../artifacts/contracts/utils/segment.sol/segment.json').abi;

async function mint() {
    const [signer, addr1] = await ethers.getSigners()
    var contract_1155 = new ethers.Contract(Segment, abi_1155, addr1.provider);
    const set = await contract_1155.connect(addr1).Mint(addr1.address);
    console.log(set);
}
mint()