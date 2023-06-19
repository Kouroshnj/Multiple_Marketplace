const { ethers } = require('hardhat');

const NftBoxContractMain = "NftBox";
const LandContractMain = "Land";
const SegmentContractMain = "segment";
const SpaceShipContractMain = "SpaceShip";
const resurcesContractMain = "resurces";
const BUSDContractMain = "BUSD";


async function MarketplaceContracts() {
    const [deployer] = await ethers.getSigners();

    // console.log(deployer);
    // console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const NftBoxContract = await ethers.getContractFactory(NftBoxContractMain); //Replace with name of your smart contract
    const NftBox = await NftBoxContract.deploy();
    NftBox.deployed()
    console.log("NFTBOX:", NftBox.address);

    const LandContract = await ethers.getContractFactory(LandContractMain); //Replace with name of your smart contract
    const Land = await LandContract.deploy();
    Land.deployed()
    console.log("LAND:", Land.address);

    const SpaceShipContract = await ethers.getContractFactory(SpaceShipContractMain); //Replace with name of your smart contract
    const Ship = await SpaceShipContract.deploy();
    Ship.deployed()
    console.log("SPACESHIP:", Ship.address);

    const SegmentContract = await ethers.getContractFactory(SegmentContractMain); //Replace with name of your smart contract
    const Segment = await SegmentContract.deploy();
    Segment.deployed()
    console.log("SEGMENT:", Segment.address);

    const BUSDContract = await ethers.getContractFactory(BUSDContractMain);
    const BUSD = await BUSDContract.deploy();
    BUSD.deployed();
    console.log("BUSD:", BUSD.address);

    const ResurcesContract = await ethers.getContractFactory(resurcesContractMain); //Replace with name of your smart contract
    const Resurces = await ResurcesContract.deploy();
    Resurces.deployed()
    console.log("RESURCES:", Resurces.address);
    let contractAddresses = {}
    contractAddresses["Ship"] = Ship.address
    contractAddresses["Land"] = Land.address
    contractAddresses["NftBox"] = NftBox.address
    contractAddresses["Segment"] = Segment.address
    contractAddresses["Resurces"] = Resurces.address
    contractAddresses["BUSD"] = BUSD.address
    return contractAddresses
}
module.exports = {
    MarketplaceContracts
};
