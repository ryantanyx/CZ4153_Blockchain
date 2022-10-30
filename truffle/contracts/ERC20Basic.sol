// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./enums/Side.sol";

contract ERC20Basic is ERC20, Ownable {

    
    Side public side;
    address internal contractAddress;

    constructor(string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
    {}

    /**
     * Public minting function (for testing purposes)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}