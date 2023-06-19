const { ethers } = require('hardhat');
const { Land } = require("../data/addresses.json")
const { Segment } = require("../data/addresses.json")
const { BUSD } = require("../data/addresses.json")
const abi_721 = require('../artifacts/contracts/utils/Land.sol/Land.json').abi;
const abi_1155 = require('../artifacts/contracts/utils/segment.sol/segment.json').abi;
const abi_BUSD = require('../artifacts/contracts/utils/BUSD.sol/BUSD.json').abi;
const marketplace = require("../data/address_this.json");
console.log(marketplace);
async function app() {
    const [signer, addr1] = await ethers.getSigners();
    const contract = new ethers.Contract(Land, abi_721, addr1.provider);
    for (let i = 1; i < 21; i++) {
        const set = await contract.connect(addr1).approve(marketplace, i)
    }
    // const set = await contract.connect(addr1).approve(marketplace, "1")
}
app()

async function app_BUSD() {
    const [signer, addr1] = await ethers.getSigners();
    const contract = new ethers.Contract(BUSD, abi_BUSD, addr1.provider);
    const amount = "100000000000000000000000000000000000000000"
    const set_BUSD = await contract.connect(addr1).approve(marketplace, amount);
    const set_BUSD2 = await contract.connect(signer).approve(marketplace, amount);
    console.log(set_BUSD);
}
app_BUSD()

async function app_Segment() {
    const [signer, addr1] = await ethers.getSigners();
    const contract = new ethers.Contract(Segment, abi_1155, addr1.provider);
    const set_Seg = await contract.connect(addr1).setApprovalForAll(marketplace, true);
    console.log(set_Seg);
}
app_Segment()