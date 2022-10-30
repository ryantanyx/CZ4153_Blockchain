// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./enums/Side.sol";

contract InternalToken{
    using SafeMath for uint256;

    mapping(Side => uint256) private internalTokenCounts;
    address private predGameAddress;
    uint256 private K; //CPMM invariant

    modifier onlyPredGameOwner() {
        require(msg.sender == predGameAddress, "You can only call this contract from the correct Prediction Game!");
        _;
    }

    constructor(
        uint256 initialValue,
        address gameAddress
    ){
        internalTokenCounts[Side.YES] = initialValue;
        internalTokenCounts[Side.NO] = initialValue;
        predGameAddress = gameAddress;
    }

    function setValue(uint256 value)
    external onlyPredGameOwner{
        internalTokenCounts[Side.YES] = SafeMath.add(internalTokenCounts[Side.YES], value);
        internalTokenCounts[Side.NO] = SafeMath.add(internalTokenCounts[Side.NO], value);
        K = SafeMath.mul(internalTokenCounts[Side.YES], internalTokenCounts[Side.NO]);
    }

    // constant product market maker
    function CPMM(uint value, Side betSide)
        external
        returns (uint)
    {
        uint togive;
        internalTokenCounts[Side.YES] = SafeMath.add(internalTokenCounts[Side.YES], value);
        internalTokenCounts[Side.NO] = SafeMath.add(internalTokenCounts[Side.NO], value);
        uint newProduct = SafeMath.mul(internalTokenCounts[Side.YES], internalTokenCounts[Side.NO]);

        if (betSide == Side.YES) {
            togive = SafeMath.div(SafeMath.sub(newProduct, K), internalTokenCounts[Side.NO]);
            internalTokenCounts[Side.YES] = SafeMath.sub(internalTokenCounts[Side.YES], togive);
        }
        else {
            togive = SafeMath.div(SafeMath.sub(newProduct, K), internalTokenCounts[Side.YES]);
            internalTokenCounts[Side.NO] = SafeMath.sub(internalTokenCounts[Side.NO], togive);
        }

        K = SafeMath.mul(internalTokenCounts[Side.YES], internalTokenCounts[Side.NO]); //update K in case of division remainders

        return togive;
    }

    function seeInternalTokens(Side value)
        public
        view
        returns (
            uint
        )
    {
        return internalTokenCounts[value];
    }
}