const { expect } = require("chai");
const { ethers } = require('hardhat');
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Land deploying", function () {
    let LandContract;
    let zero = "0x0000000000000000000000000000000000000000"


    async function deploy() {
        const [signer, addr1] = await ethers.getSigners();
        console.log((await signer.getBalance()).toString());
        const contract = await ethers.getContractFactory("Land");
        LandContract = await contract.deploy();
        await LandContract.deployed();
    }
    beforeEach(deploy);

    async function minting() {
        const [signer, addr1] = await ethers.getSigners();
        await LandContract.connect(signer).mintToken("kourosh");
    }
    beforeEach(minting)

    async function createMarketItem() {
        const [signer, addr1] = await ethers.getSigners();

    }

    it("should have minted token", async function () {
        const [signer, addr1] = await ethers.getSigners();
        console.log(signer.address);
        expect(await LandContract.ownerOf("1")).to.eq(signer.address);
    })

})
