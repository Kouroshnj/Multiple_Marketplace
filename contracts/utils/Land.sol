// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// TO DO: Explain the reason/advantadge to use ERC721URIStorage instead of ERC721 itself
contract Land is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private marketplaceAddress;
    address public owner;
    mapping(uint256 => address) public _creators;

    event TokenMinted(
        uint256 indexed tokenId,
        string tokenURI,
        address marketplaceAddress
    );

    constructor() ERC721("Land", "LND") {
        owner = msg.sender;
    }

    function mintToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _creators[newItemId] = msg.sender;
        _setTokenURI(newItemId, tokenURI);

        // Give the marketplace approval to transact NFTs between users
        setApprovalForAll(marketplaceAddress, true);

        emit TokenMinted(newItemId, tokenURI, marketplaceAddress);
        return newItemId;
    }

    function user(uint _tokenId) public view returns (address) {
        return _creators[_tokenId];
    }
}
