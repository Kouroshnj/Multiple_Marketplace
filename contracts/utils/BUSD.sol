// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BUSD is ERC20 {
    address owner;

    constructor() ERC20("Binance USD", "BUSD") {
        owner = msg.sender;
        _mint(owner, 1000e20);
    }

    function mint(address to) public {
        uint amount = 1000e20;
        _mint(to, amount);
    }

    function approve_BUSD(address spender) public {
        uint amount = 1000e20;
        _approve(owner, spender, amount);
    }
}
