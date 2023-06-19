const ethers = require('ethers');

function getContract(abi, address, provider) {
    var contract = new ethers.Contract(address, abi, provider);
    return contract
}
module.exports = getContract