const { expect } = require("chai");
const { ethers } = require('hardhat');
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");
const { BUSD } = require('../data/addresses.json');
const abi_BUSD = require('../artifacts/contracts/utils/BUSD.sol/BUSD.json').abi;


describe("deploy all addresses", function () {
    let NftBox
    let Land
    let Segment
    let SpaceShip
    let Resurces
    let BUSD
    let marketplace;

    async function deploy() {
        const [signer, addr1, addr2] = await ethers.getSigners();

        const NftBoxContract = await ethers.getContractFactory("NftBox"); //Replace with name of your smart contract
        NftBox = await NftBoxContract.deploy();
        await NftBox.deployed()

        const LandContract = await ethers.getContractFactory("Land"); //Replace with name of your smart contract
        Land = await LandContract.deploy();
        await Land.deployed()
        console.log("Land address is:", Land.address);

        const SpaceShipContract = await ethers.getContractFactory("SpaceShip"); //Replace with name of your smart contract
        SpaceShip = await SpaceShipContract.deploy();
        await SpaceShip.deployed()

        const SegmentContract = await ethers.getContractFactory("segment"); //Replace with name of your smart contract
        Segment = await SegmentContract.deploy();
        await Segment.deployed()

        const BUSDContract = await ethers.getContractFactory("BUSD");
        BUSD = await BUSDContract.deploy();
        await BUSD.deployed();

        const ResurcesContract = await ethers.getContractFactory("resurces"); //Replace with name of your smart contract
        Resurces = await ResurcesContract.deploy();
        await Resurces.deployed()

        const Contract = await ethers.getContractFactory("Marketplace"); //Replace with name of your smart contract
        marketplace = await Contract.deploy(Land.address, SpaceShip.address, NftBox.address, Segment.address, Resurces.address, BUSD.address);

    }
    beforeEach(deploy);

    async function mint() {
        const [signer, addr1, addr2] = await ethers.getSigners();
        for (let i = 1; i < 21; i++) {
            await Land.connect(addr1).mintToken("kourosh");
        }
        await Segment.connect(signer).Mint(signer.address);
        await Land.connect(addr1).approve(marketplace.address, "1");
        await Segment.connect(signer).setApprovalForAll(marketplace.address, true);
        const value = await ethers.utils.parseEther("10000")
        await BUSD.connect(signer).mint(signer.address);
        await BUSD.connect(signer).mint(addr1.address);
        await BUSD.connect(signer).mint(addr2.address);
        await BUSD.connect(signer).approve(marketplace.address, value)
        await BUSD.connect(addr1).approve(marketplace.address, value)
        await BUSD.connect(addr2).approve(marketplace.address, value)

    }
    beforeEach(mint);

    async function createMarketItem(nftAddress, nftId, price, quantity, fee) {
        const [signer, addr1] = await ethers.getSigners();
        return marketplace.connect(signer).RealList(nftAddress, nftId, price, quantity, { value: fee });
    }


    it("should have minted token", async function () {
        const [signer, addr1] = await ethers.getSigners();
        console.log("BUSD balance is:", await BUSD.balanceOf(signer.address));
        expect(await Land.ownerOf("1")).to.equal(signer.address);
        expect(await Segment.balanceOf(signer.address, "1")).to.equal("500");
    })

    it("should create marketItem", async function () {
        const [signer, addr1] = await ethers.getSigners();
        const amount = "1000000000000000000000000000000"
        for (let i = 1; i < 21; i++) {
            await Land.connect(signer).approve(marketplace.address, "1");
        }
        await BUSD.connect(signer).approve(marketplace.address, amount);
        await marketplace.connect(signer).RealList(Land.address, "1", "5000000000000000000", "1")

        const UserInfo = [
            marketplace.address,
            signer.address,
            Land.address,
            BigNumber.from("5000000000000000000"),
            BigNumber.from("0x01"),
            BigNumber.from("0x01"),
            BigNumber.from("0x01"),
            false,
            false
        ]
        expect(await marketplace.Info("1")).to.eql(UserInfo);
    })

    it("should revert the creation of marketItem for giving wrong listfeeInBNB", async function () {
        const [signer, addr1] = await ethers.getSigners();

        const price = ethers.utils.parseEther("5")
        const feeBNB = await marketplace.Fee_BNB(price);
        const wrongFee = feeBNB.div(2)
        // const Optional = { value: wrongFee }
        const quantity = "1";
        const nftId = "2"

        await expect(createMarketItem(Land.address, nftId, price, quantity, wrongFee)).to.be.revertedWith("List error!");

    })

    it("should revert an error for wrong quantity", async function () {
        const [signer, addr1] = await ethers.getSigners();
        const price = ethers.utils.parseEther("5")
        const feeBNB = await marketplace.Fee_BNB(price);
        const wrongQuantity = "2";
        const Quantity = "1";
        const nftId = "3";

        await expect(createMarketItem(Land.address, nftId, price, wrongQuantity, feeBNB)).to.be.revertedWith("helper error");

        // console.log(await marketplace.getAllUsers());
    })

    it("should be successful to list with busd", async function () {
        const [signer, addr1] = await ethers.getSigners();
        const price = ethers.utils.parseEther("6")
        const Quantity = "40";
        const nftId = "1";
        await Segment.connect(signer).setApprovalForAll(marketplace.address, true)

        await marketplace.connect(signer).RealList(Segment.address, nftId, price, Quantity)
        expect(await BUSD.balanceOf(marketplace.address)).to.equal("150000000000000000")
    })

    it("should cancel a marketItem correctly", async function () {
        const [signer, addr1] = await ethers.getSigners();
        const price = ethers.utils.parseEther("6")
        const Quantity = "60";
        const nftId = "2";
        await Segment.connect(signer).setApprovalForAll(marketplace.address, true)

        await marketplace.connect(signer).RealList(Segment.address, nftId, price, Quantity)

        await marketplace.connect(signer).CancelItem("1");

        expect(await Segment.balanceOf(marketplace.address, "2")).to.be.equal("0")
    })

    it("should not be able to cancel when already canceled", async function () {
        const [signer, addr1] = await ethers.getSigners();
        const price = ethers.utils.parseEther("6")
        const Quantity = "50";
        const nftId = "1";
        await Segment.connect(signer).setApprovalForAll(marketplace.address, true)

        await marketplace.connect(signer).RealList(Segment.address, nftId, price, Quantity)

        await marketplace.connect(signer).CancelItem("1");

        await expect(marketplace.connect(signer).CancelItem("1")).to.be.revertedWith("already canceled!")
    })

    it("after list owner must be marketplace", async function () {
        const [signer, addr1] = await ethers.getSigners();
        const price = ethers.utils.parseEther("6")
        const Quantity = "1";
        const nftId = "1";
        await Land.connect(signer).approve(marketplace.address, "1")

        await marketplace.connect(signer).RealList(Land.address, nftId, price, Quantity)

        const ownerOfNFT = await Land.ownerOf("1");
        await expect(ownerOfNFT).to.be.eq(marketplace.address);
    })

    it("should buy and selling NFT without any problem", async function () {
        const [signer, addr1, addr2] = await ethers.getSigners();
        const price1 = ethers.utils.parseEther("6")
        const price2 = ethers.utils.parseEther("8")
        const Quantity_Land = "1";
        const Quantity_Segment = "45";
        const nftId_Land = "1";
        const nftId_Segment = "1";

        await Land.connect(signer).approve(marketplace.address, "1");
        await Segment.connect(signer).setApprovalForAll(marketplace.address, true);


        await marketplace.connect(signer).RealList(Land.address, nftId_Land, price1, Quantity_Land);
        await marketplace.connect(signer).RealList(Segment.address, nftId_Segment, price1, Quantity_Segment);

        const tokenId1 = "1"
        const tokenId2 = "2"
        await marketplace.connect(addr1).RealBuy(tokenId1, { value: "21075257206762013" });
        await marketplace.connect(addr1).RealBuy(tokenId2);

        await Land.connect(addr1).approve(marketplace.address, "1");
        await Segment.connect(addr1).setApprovalForAll(marketplace.address, true);

        await marketplace.connect(addr1).RealList(Land.address, nftId_Land, price2, Quantity_Land);
        await marketplace.connect(addr1).RealList(Segment.address, nftId_Segment, price2, Quantity_Segment);

        const tokenId3 = "3";
        const tokenId4 = "4";

        await marketplace.connect(addr2).RealBuy(tokenId3);
        await marketplace.connect(addr2).RealBuy(tokenId4, { value: "28100342942349351" });

        // expect(await Land.ownerOf("1")).to.be.eq(addr2.address)
        expect(await Segment.balanceOf(addr2.address, "1")).to.be.equal("45");
    })

    it("should revert when canceling nonexistent marketItem", async function () {
        const [signer, addr1, addr2] = await ethers.getSigners();
        const price = ethers.utils.parseEther("6")
        const Quantity_Land = "1";
        const nftId_Land = "1";

        await Land.connect(signer).approve(marketplace.address, "1");

        await marketplace.connect(signer).RealList(Land.address, nftId_Land, price, Quantity_Land);

        await expect(marketplace.connect(signer).CancelItem("2")).to.be.revertedWith("nft owner!");
    })

    it("should revert when NotOwner try to cancel marketItem", async function () {
        const [signer, addr1, addr2] = await ethers.getSigners();
        const price = ethers.utils.parseEther("6")
        const Quantity_Land = "1";
        const nftId_Land = "1";

        await Land.connect(signer).approve(marketplace.address, "1");

        await marketplace.connect(signer).RealList(Land.address, nftId_Land, price, Quantity_Land);

        await expect(marketplace.connect(addr1).CancelItem("1")).to.be.revertedWith("nft owner!");
    })

    it("should transfer BNB after Listing", async function () {
        const [signer, addr1] = await ethers.getSigners();
        const price = ethers.utils.parseEther("5")
        const Quantity_Land = "1";
        const nftId_Land = "1";
        console.log("privious balance:", await signer.getBalance());
        const tx = await marketplace.connect(addr1).RealList(Land.address, nftId_Land, price, Quantity_Land, { value: "439067858474208" });

        const receipt = await tx.wait();
        const gasSpent = receipt.gasUsed.mul(receipt.effectiveGasPrice);
        const balance = await signer.getBalance();
        console.log("current balance:", await signer.getBalance());
        expect(await signer.getBalance()).to.eq(balance);
    })
})

