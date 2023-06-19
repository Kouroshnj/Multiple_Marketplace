const { ethers } = require('hardhat');
const connector = require('../utils/connect');
const { Land } = require('../data/addresses.json');
const { Segment } = require('../data/addresses.json');




// async function Buy() {
//     const [signer, addr1] = await ethers.getSigners();
//     console.log(signer.address);
//     const contract = await connector();
//     const set = await contract.connect(signer).BuyItemWithBNB("2", { value: "21075257206762013" });
//     console.log(set);
// }
// Buy();

// async function Buy() {
//     const [signer, addr1] = await ethers.getSigners();
//     console.log(signer.address);
//     const contract = await connector();
//     const set = await contract.connect(signer).RealBuy("2");
//     console.log(set);
// }
// Buy();

async function Buy_BUSD() {
    const [signer, addr1] = await ethers.getSigners();
    console.log(signer.address);
    const contract = await connector();
    const set = await contract.connect(signer).RealBuy("2");
    console.log(set);
}
Buy_BUSD()