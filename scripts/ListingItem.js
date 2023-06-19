const { ethers } = require('hardhat');
const { Land } = require('../data/addresses.json');
const { Segment } = require('../data/addresses.json');
const connector = require('../utils/connect');

async function Listing() {
    const [signer, addr1] = await ethers.getSigners();
    console.log("before", await signer.getBalance());
    const contract = await connector();
    const set = await contract.connect(addr1).RealList(Land, "4", "5000000000000000000", "1", { value: "439067858474208" });
    console.log("After", await signer.getBalance());
    console.log(set);                                                                                //"21075257206762013"      
}
Listing();

async function Listing_BUSD() {
    const [signer, addr1] = await ethers.getSigners();
    const contract_BUSD = await connector();
    const set_Seg = await contract_BUSD.connect(addr1).RealList(Segment, "1", "6000000000000000000", "100");
    // console.log(set_Seg);
}
Listing_BUSD();

