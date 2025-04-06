// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./utils/ChainlinkOracle.sol";

pragma solidity ^0.8.7;

contract Marketplace is ERC1155Holder, ReentrancyGuard, ChainlinkOracle {
    using Counters for Counters.Counter;
    // using SafeMath for uint256;
    Counters.Counter private MarketItemIds;
    Counters.Counter private MarketItemIds_Sold;
    Counters.Counter private MarketItemIds_Canceled;

    address private owner;
    uint private FeeToContract = 40;

    IERC20 private BUSD;
    IERC721 private Land;
    IERC721 private Ship;
    IERC1155 private NftBox;
    IERC1155 private Segment;
    IERC1155 private Resurces;

    mapping(uint => MarketItem) private MarketItemInfo;

    struct MarketItem {
        address payable owner;
        address payable seller;
        address nftAddress;
        uint256 price;
        uint256 marketItemID;
        uint256 tokenId;
        uint256 quantity;
        bool sold;
        bool canceled;
    }

    constructor(
        address _Land,
        address _Ship,
        address _NftBox,
        address _Segment,
        address _Resurces,
        address _BUSD
    ) {
        Land = IERC721(_Land);
        Ship = IERC721(_Ship);
        NftBox = IERC1155(_NftBox);
        Segment = IERC1155(_Segment);
        Resurces = IERC1155(_Resurces);
        BUSD = IERC20(_BUSD);
        owner = msg.sender;
    }

    modifier zeroAmount(uint _amount) {
        _zeroAmount(_amount);
        _;
    }

    modifier zeroAddress(uint MarketItemId) {
        _zeroAddress(MarketItemId);
        _;
    }

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    modifier NotCanceled(uint MarketItemId) {
        _NotCanceled(MarketItemId);
        _;
    }

    modifier ItemIdOwner(uint MarketItemId) {
        _ItemIdOwner(MarketItemId);
        _;
    }

    modifier SoldOut(uint MarketItemId) {
        _SoldOut(MarketItemId);
        _;
    }

    function Choosing(
        address _nftAddress,
        uint256 _nftid,
        uint256 _price,
        uint256 _quantity
    ) private returns (uint256) {
        MarketItemIds.increment();
        uint256 current = MarketItemIds.current();
        address Address = ListingHelper(_nftAddress, _nftid, _quantity);
        MarketItemInfo[current].nftAddress = Address;
        MarketItemInfo[current].owner = payable(address(this));
        MarketItemInfo[current].seller = payable(msg.sender);
        MarketItemInfo[current].price = _price;
        MarketItemInfo[current].marketItemID = current;
        MarketItemInfo[current].tokenId = _nftid;
        MarketItemInfo[current].quantity = _quantity;
        MarketItemInfo[current].sold = false;
        MarketItemInfo[current].canceled = false;
        return current;
    }

    receive() external payable {}

    function RealList(
        address nftAddress,
        uint nftid,
        uint price,
        uint quantity
    ) public payable nonReentrant returns (uint) {
        if (msg.value > 0) {
            uint feeWithBNB = Fee_BNB(price);
            require(msg.value >= feeWithBNB, "List error!");
            (bool sent, ) = owner.call{value: msg.value}("");
            require(sent, "Send Error!");
        } else {
            uint feeWithBUSD = SafeMath.div(price, FeeToContract);
            BUSD.transferFrom(msg.sender, owner, feeWithBUSD);
        }
        uint256 currentId = Choosing(nftAddress, nftid, price, quantity);
        return currentId;
    }

    function RealBuy(
        uint marketItemId
    )
        public
        payable
        SoldOut(marketItemId)
        NotCanceled(marketItemId)
        zeroAddress(marketItemId)
        nonReentrant
    {
        uint Price = MarketItemInfo[marketItemId].price;
        address Seller = MarketItemInfo[marketItemId].seller;
        if (msg.value > 0) {
            require(msg.value >= GiveBUSDgetBNB(Price), "exact amount");
            (bool sent, ) = Seller.call{value: msg.value}("");
            require(sent, "Send Error!");
        } else {
            BUSD.transferFrom(msg.sender, Seller, Price);
        }
        BuyOrCancelHelper(marketItemId);
        MarketItemInfo[marketItemId].owner = payable(msg.sender);
        MarketItemInfo[marketItemId].sold = true;
        MarketItemIds_Sold.increment();
    }

    function CancelItem(
        uint marketItem
    )
        public
        ItemIdOwner(marketItem)
        NotCanceled(marketItem)
        SoldOut(marketItem)
    {
        BuyOrCancelHelper(marketItem);
        MarketItemInfo[marketItem].owner = payable(msg.sender);
        MarketItemInfo[marketItem].canceled = true;
        MarketItemIds_Canceled.increment();
    }

    function Fee_BNB(
        uint256 _amount
    ) public view zeroAmount(_amount) returns (uint256) {
        uint256 BNBprice = getlatestCustomePrice();
        uint256 calculated = SafeMath.mul(_amount, 10 ** 18);
        uint256 PriceInBNB = SafeMath.div(calculated, BNBprice);
        uint256 fee = SafeMath.div(PriceInBNB, FeeToContract); // 2.5% of nft price
        return fee;
    }

    function GiveBUSDgetBNB(
        uint256 _amount
    ) public pure zeroAmount(_amount) returns (uint256) {
        uint256 BNBprice = getlatestCustomePrice();
        uint256 calculated = SafeMath.mul(_amount, 10 ** 18);
        uint256 PriceInBNB = SafeMath.div(calculated, BNBprice);
        return PriceInBNB;
    }

    function BuyOrCancelHelper(uint marketItem) private {
        uint tokenID = MarketItemInfo[marketItem].tokenId;
        uint Quantity = MarketItemInfo[marketItem].quantity;
        address nftAddress = MarketItemInfo[marketItem].nftAddress;
        if (nftAddress == address(Land) || nftAddress == address(Ship)) {
            IERC721(nftAddress).transferFrom(
                address(this),
                msg.sender,
                tokenID
            );
        } else if (
            nftAddress == address(NftBox) ||
            nftAddress == address(Segment) ||
            nftAddress == address(Resurces)
        ) {
            IERC1155(nftAddress).safeTransferFrom(
                address(this),
                msg.sender,
                tokenID,
                Quantity,
                ""
            );
        }
    }

    function ListingHelper(
        address _nftAddress,
        uint _nftid,
        uint _quantity
    ) private returns (address) {
        if (_nftAddress == address(Land) || _nftAddress == address(Ship)) {
            require(_quantity == 1, "helper error");
            IERC721(_nftAddress).transferFrom(
                msg.sender,
                address(this),
                _nftid
            );
        } else if (
            _nftAddress == address(NftBox) ||
            _nftAddress == address(Segment) ||
            _nftAddress == address(Resurces)
        ) {
            IERC1155(_nftAddress).safeTransferFrom(
                msg.sender,
                address(this),
                _nftid,
                _quantity,
                ""
            );
        }
        return _nftAddress;
    }

    function SetFee(uint NewFee) public onlyOwner returns (uint) {
        FeeToContract = NewFee;
        return FeeToContract;
    }

    function Info(uint marketItemId) public view returns (MarketItem memory) {
        return MarketItemInfo[marketItemId];
    }

    function getAllUsers() public view returns (MarketItem[] memory) {
        uint current = MarketItemIds.current();
        MarketItem[] memory AllUsers = new MarketItem[](current);
        uint j = 0;
        for (uint i = current; i > 0; i--) {
            AllUsers[j] = MarketItemInfo[i];
            j++;
        }
        return AllUsers;
    }

    function ContractItems() public view returns (MarketItem[] memory) {
        uint current = MarketItemIds.current();
        uint allitems = MarketItemIds.current();
        MarketItem[] memory Items = new MarketItem[](current);
        uint j = 0;
        for (uint i = allitems; i > 0; i--) {
            if (MarketItemInfo[i].owner == address(this)) {
                Items[j] = MarketItemInfo[i];
                j++;
            }
        }
        return Items;
    }

    function CanceledItems() public view returns (MarketItem[] memory) {
        uint current = MarketItemIds_Canceled.current();
        uint allitems = MarketItemIds.current();
        MarketItem[] memory Canceled_Items = new MarketItem[](current);
        uint j = 0;
        for (uint i = allitems; i > 0; i--) {
            if (MarketItemInfo[i].canceled) {
                Canceled_Items[j] = MarketItemInfo[i];
                j++;
            }
        }
        return Canceled_Items;
    }

    function BoughtItems() public view returns (MarketItem[] memory) {
        uint current = MarketItemIds_Sold.current();
        uint allitems = MarketItemIds.current();
        MarketItem[] memory Bought_Items = new MarketItem[](current);
        uint j = 0;
        for (uint i = allitems; i > 0; i--) {
            if (MarketItemInfo[i].sold) {
                Bought_Items[j] = MarketItemInfo[i];
                j++;
            }
        }
        return Bought_Items;
    }

    function _SoldOut(uint MarketItemId) private view {
        require(!MarketItemInfo[MarketItemId].sold, "already sold");
    }

    function _ItemIdOwner(uint MarketItemId) private view {
        require(
            MarketItemInfo[MarketItemId].seller == msg.sender,
            "nft owner!"
        );
    }

    function _NotCanceled(uint MarketItemId) private view {
        require(!MarketItemInfo[MarketItemId].canceled, "already canceled!");
    }

    function _onlyOwner() private view {
        require(msg.sender == owner, "Contract Owner");
    }

    function _zeroAmount(uint _amount) private pure {
        require(_amount > 0, "zero amount");
    }

    function _zeroAddress(uint MarketItemId) private view {
        require(
            MarketItemInfo[MarketItemId].seller != address(0),
            "not exist!"
        );
    }
}
