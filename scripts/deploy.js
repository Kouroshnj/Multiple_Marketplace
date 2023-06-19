const routhPath = require('../utils/routePath');
const path = require('path');
const { MarketplaceContracts } = require('./deployallnfts');

const fs = require('fs');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(deployer);
  const addresses = await MarketplaceContracts()
  fs.writeFileSync("./data/addresses.json", JSON.stringify(addresses))
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Contract = await ethers.getContractFactory("Marketplace"); //Replace with name of your smart contract
  const contract = await Contract.deploy(addresses.Land, addresses.Ship, addresses.NftBox, addresses.Segment, addresses.Resurces, addresses.BUSD);
  fs.writeFileSync("./data/address_this.json", JSON.stringify(contract.address))

  console.log("contract address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
