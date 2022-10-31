// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

library SharedStructs {
    struct Payload{
        string betTitle;
        uint256 expiryDate;
        string choiceA;
        string choiceB;
        string sportId;
        string gameId;
    }
}