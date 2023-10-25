// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

contract TokenMarketPlace is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply, IERC1155Receiver {

    using Counters for Counters.Counter;
    using Strings for uint256;

    // A counter for all kinds of tokens
    Counters.Counter private _tokenIds;

    /****************************************************
     state variables and events to handle fungible tokens
    ****************************************************/
    struct FungibleToken {
        uint256 fungibleTokenID;
        address owner;
        uint256 price;
    }

    // An array to store all fungible token IDs
    uint256[] private _allFungibleTokenIds;

    // Mapping from fungible token ID to FungibleToken struct
    mapping(uint256 => FungibleToken) private _fungibleTokens;

    // A mapping from owner to list of owned fungible token IDs
    mapping(address => uint256[]) private _ownedFungibleTokens;

    // Event emitted when a new fungible token is added
    event FungibleTokenAdded(uint256 indexed fungibleTokenID, address indexed owner, uint256 price);

    // Event emitted when a fungible token is removed
    event FungibleTokenRemoved(uint256 indexed fungibleTokenID);

    /****************************************************
     state variables and events to handle non fungible tokens (NFTs)
    ****************************************************/

    // An array to store all non fungible token IDs
    uint256[] private _allNonFungibleTokenIds;

    // A mapping from owner to list of owned non fungible token IDs
    mapping(address => uint256[]) private _ownedNonFungibleTokens;

    // Event emitted when a non-fungible token is purchased
    event NonFungibleTokenPurchased(uint256 indexed nonFungibleTokenID, address indexed buyer, uint256 price);

    /****************************************************
     constructor and functions
    ****************************************************/ 

    constructor() ERC1155("http://localhost:5984/houseofmusic/") {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    // mintFungibleToken mints a new fungible token and adds it to the marketplace
    // params:
    // _owner: the owner of the fungible token
    // _totalSupply: the total supply of the fungible token
    // _price: the price of the fungible token
    function mintFungibleToken(address _owner, uint256 _totalSupply, uint256 _price) public onlyOwner {
        uint256 newFungibleTokenID = _tokenIds.current();
        _mint(address(this), newFungibleTokenID, _totalSupply, "");
        _allFungibleTokenIds.push(newFungibleTokenID);

        _tokenIds.increment();

        _fungibleTokens[newFungibleTokenID] = FungibleToken({
            fungibleTokenID: newFungibleTokenID,
            owner: _owner,
            price: _price
        });

        _ownedFungibleTokens[_owner].push(newFungibleTokenID);

        emit FungibleTokenAdded(newFungibleTokenID, _owner, _price);
    }

    function removeFungibleToken(uint256 fungibleTokenID) public onlyOwner {
        _burn(address(this), fungibleTokenID, totalSupply(fungibleTokenID));

        // remote the fungible token from the array of fungible token IDs owned by the owner
        deleteFromArray(_ownedFungibleTokens[_fungibleTokens[fungibleTokenID].owner], fungibleTokenID);
        // remove the fungible token from the array of all fungible token IDs
        deleteFromArray(_allFungibleTokenIds, fungibleTokenID);
        
        // remove the struct from the mapping of fungible tokens
        delete _fungibleTokens[fungibleTokenID];

        emit FungibleTokenRemoved(fungibleTokenID);

    }

    // purchaseNonFungibleToken purchases a non-fungible token from the marketplace.
    // The fungible token is burned and a new non-fungible token is minted.
    // params:
    // fungibleTokenID: the ID of the fungible token to purchase
    // msg.value: the amount of Ether sent to the contract (should be equal to the price of the fungible token)
    // msg.sender: the address of the buyer
    function purchaseNonFungibleToken(uint256 fungibleTokenID) public payable {
        require(msg.value >= _fungibleTokens[fungibleTokenID].price, "Not enough Ether to purchase this non-fungible token");
        require(totalSupply(fungibleTokenID) > 0, "No non-fungible tokens left to purchase");

        _burn(address(this), fungibleTokenID, 1);

        uint256 newNonFungibleTokenID = _tokenIds.current();
        _mint(msg.sender, newNonFungibleTokenID, 1, "");
        _allNonFungibleTokenIds.push(newNonFungibleTokenID);

        _tokenIds.increment();

        // add the new non-fungible token to the list of non-fungible tokens owned by the buyer
        _ownedNonFungibleTokens[msg.sender].push(newNonFungibleTokenID);
        
        payable(_fungibleTokens[fungibleTokenID].owner).transfer(_fungibleTokens[fungibleTokenID].price);

        emit NonFungibleTokenPurchased(newNonFungibleTokenID, msg.sender, _fungibleTokens[fungibleTokenID].price);

    }

    // returns the data associated to a fungible token
    function getFungibleTokenInfo(uint256 fungibleTokenID) public view returns (FungibleToken memory) {
        return _fungibleTokens[fungibleTokenID];
    }

    // override the _beforeTokenTransfer function to call both ERC1155Supply and ERC1155
    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    internal virtual override(ERC1155, ERC1155Supply)
    {
        ERC1155Supply._beforeTokenTransfer(operator, from, to, ids, amounts, data);
        ERC1155._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    // override the uri function to return the concatenation of token uri + tokenId
    function uri(uint256 tokenId) public view override returns (string memory) 
    {
        string memory baseURI = super.uri(tokenId);
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    // returns a list of all existing fungible token IDs.
    function getAllFungibleTokenIDs() public view returns (uint256[] memory) {
        return _allFungibleTokenIds;
    }

    // returns a list of fungible token IDs owned by the msg.sender
    function getFungibleTokensByOwner() public view returns (uint256[] memory) {
        return _ownedFungibleTokens[msg.sender];
    }

    // returns a list of non-fungible token IDs owned by the msg.sender
    function getNonFungibleTokensByOwner() public view returns (uint256[] memory) {
        return _ownedNonFungibleTokens[msg.sender];
    }

    // returns all non-fungible token IDs owned by all users
    function getAllNonFungibleTokens() public view  onlyOwner returns (uint256[] memory) {
        return _allNonFungibleTokenIds;
    }

    // helper function to delete an element from an array specified by its value.
    // (used to delete token IDs from the array of existing tokens)
    function deleteFromArray(uint256[] storage array, uint256 value) internal {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }

    // functions to receive ERC1155 tokens
    function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    // functions to receive ERC1155 tokens
    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    /****************************************************
    functions used for debugging
    ****************************************************/ 
    // function to get the next token ID available
    function getNextTokenID() public view returns (uint256) {
        return _tokenIds.current();
    }

}
