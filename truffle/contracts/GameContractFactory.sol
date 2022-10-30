// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "./PredictionGame.sol";

contract GameContractFactory {
    
    function createGameContract(
        address addr, 
        uint256 expiryTime, 
        address tokenA, 
        address tokenB, 
        string memory betTitle, 
        string memory choiceA, 
        string memory choiceB) external         
        returns(PredictionGame)
    {
        return new PredictionGame(
            addr,
            expiryTime,
            tokenA,
            tokenB,
            betTitle,
            choiceA,
            choiceB
        );
    }
}