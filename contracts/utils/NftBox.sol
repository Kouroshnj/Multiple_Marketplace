// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Error.sol";

contract NftBox is Error, ERC1155URIStorage {
    constructor()
        ERC1155(
            "ipfs://bafybeian5tiq5ysrpk2jhl32qxfir6d5bfe3k2uprzm6xabagccn6yhbei/{id}.json"
        )
    {}

    function uri(uint256 _tokenid)
        public
        pure
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "https://ipfs.io/ipfs/bafybeian5tiq5ysrpk2jhl32qxfir6d5bfe3k2uprzm6xabagccn6yhbei/",
                    Strings.toString(_tokenid),
                    ".json"
                )
            );
    }

    function SetUri(
        uint256 tokenId,
        string memory tokenURI,
        string memory password
    ) public onlyOwner(password) {
        _setURI(tokenId, tokenURI);
    }

    function SetBaseUri(string memory baseURI, string memory password)
        public
        onlyOwner(password)
    {
        _setBaseURI(baseURI);
    }

    function Mint(address to) public {
        _mint(to, 1, 500, "NftBox-tokenId1");
        _mint(to, 2, 400, "NftBox-tokenId2");
        _mint(to, 3, 200, "NftBox-tokenId3");
        _mint(to, 4, 150, "NftBox-tokenId4");
    }
}
