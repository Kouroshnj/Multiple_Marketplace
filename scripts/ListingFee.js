const connector = require('../utils/connect');

async function ListingFee() {
    const contract = await connector()
    const amount = "8000000000000000000"
    const fee = await contract.GiveBUSDgetBNB(amount)
    console.log(fee.toString());
}
ListingFee()

async function giveusdgetbnb() {
    const contract = await connector();
    const amount = "8000000000000000000";
    const fee = await contract.GiveBUSDgetBNB(amount);
    console.log("giveUsdgetBNB is :", fee.toString());
}
giveusdgetbnb()

async function Fee() {
    const contract = await connector();
    const amount = "6000000000000000000";
    const fee = await contract.Fee_BNB(amount);
    console.log(fee.toString());
}
Fee()