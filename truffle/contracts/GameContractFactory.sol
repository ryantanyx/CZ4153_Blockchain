// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "./PredictionGame.sol";
import "./SharedStructs.sol";

contract GameContractFactory {

    function createGameContract(
        address addr,
        address tokenA, 
        address tokenB, 
        SharedStructs.Payload memory payload
        ) external         
        returns(PredictionGame)
    {
        return new PredictionGame(
            addr,
            tokenA,
            tokenB,
            payload
        );
    }
}