// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Error.sol";

contract segment is Error, ERC1155URIStorage {
    // uint256 public constant segment_1 = 1;
    // uint256 public constant segment_2 = 2;
    // uint256 public constant segment_3 = 3;
    // uint256 public constant segment_4 = 4;
    // uint256 public constant segment_5 = 5;
    // uint256 public constant segment_6 = 6;
    // uint256 public constant segment_7 = 7;
    // uint256 public constant segment_8 = 8;
    // uint256 public constant segment_9 = 9;
    // uint256 public constant segment_10 = 10;
    // uint256 public constant segment_11 = 11;
    // uint256 public constant segment_12 = 12;
    // uint256 public constant segment_13 = 13;
    // uint256 public constant segment_14 = 14;
    // uint256 public constant segment_15 = 15;
    // uint256 public constant segment_16 = 16;

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
        _mint(to, 1, 500, "segment-tokenId1");
        _mint(to, 2, 400, "segment-tokenId2");
        _mint(to, 3, 200, "segment-tokenId3");
        _mint(to, 4, 150, "segment-tokenId4");
        _mint(to, 5, 500, "segment-tokenId5");
        _mint(to, 6, 400, "segment-tokenId6");
        _mint(to, 7, 200, "segment-tokenId7");
        _mint(to, 8, 150, "segment-tokenId8");
        _mint(to, 9, 500, "segment-tokenId9");
        _mint(to, 10, 400, "segment-tokenId10");
        _mint(to, 11, 200, "segment-tokenId11");
        _mint(to, 12, 150, "segment-tokenId12");
        _mint(to, 13, 400, "segment-tokenId13");
        _mint(to, 14, 200, "segment-tokenId14");
        _mint(to, 15, 150, "segment-tokenId15");
        _mint(to, 16, 500, "segment-tokenId16");
    }
}
