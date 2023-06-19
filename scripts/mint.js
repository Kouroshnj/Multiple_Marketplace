const { Land } = require('../data/addresses.json');
const { ethers } = require('hardhat');
const { BUSD } = require('../data/addresses.json');
const { Segment } = require('../data/addresses.json');



const abi_721 = require('../artifacts/contracts/utils/Land.sol/Land.json').abi;
const abi_BUSD = require('../artifacts/contracts/utils/BUSD.sol/BUSD.json').abi
const abi_Segment = require('../artifacts/contracts/utils/segment.sol/segment.json').abi



async function mint() {
    const [signer, addr1] = await ethers.getSigners()
    console.log(addr1.address);
    const contract721 = new ethers.Contract(Land, abi_721, addr1.provider);
    for (let i = 1; i < 21; i++) {
        const setData = await contract721.connect(addr1).mintToken("mammad");
    }
}
mint();


async function mint_Segment() {
    const [signer, addr1] = await ethers.getSigners();
    const contract_Seg = new ethers.Contract(Segment, abi_Segment, addr1.provider);
    const set = await contract_Seg.connect(addr1).Mint(addr1.address)

}
mint_Segment();

async function mint_BUSD() {
    const [signer, addr1] = await ethers.getSigners();
    const contract_BUSD = new ethers.Contract(BUSD, abi_BUSD, addr1.provider);
    const set = await contract_BUSD.connect(addr1).mint(addr1.address)
    const set2 = await contract_BUSD.connect(addr1).mint(signer.address)
    console.log(set);
}
mint_BUSD();    