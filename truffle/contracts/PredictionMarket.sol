// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "./PredictionGame.sol";
import "./ERC20Basic.sol";
import "./enums/Side.sol";
import "./GameContractFactory.sol";

contract PredictionMarket is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    struct Payload{
        string betTitle;
        uint256 expiryDate;
        string choiceA;
        string choiceB;
    }

    event PredictionGameCreated(
        uint256 predictionGameId,
        address creator,
        address predictionGameAddress,
        address TokenAAddress,
        address TokenBAddress
    );

    uint256 private predictionGameCount;
    mapping(uint256 => address) public predictionMarketRegistry;
    address private chainLinkAddress;
    GameContractFactory private gameFactory;

    constructor(
        address _chainLinkAddress,
        address _gameContractFactoryAddr
    ) {
        chainLinkAddress = _chainLinkAddress;
        predictionGameCount = 0;
        gameFactory = GameContractFactory(_gameContractFactoryAddr);
    }

    /**
     * Create new `PredictionGame` instance
     */
    function createGame(Payload memory payload) external {
        // 1. Create the game tokens
        string memory tokenAName = string(abi.encodePacked("PredictionGameTokenA", Strings.toString(predictionGameCount)));
        string memory tokenASymbol = string(abi.encodePacked("A", Strings.toString(predictionGameCount)));
        ERC20Basic TokenA = new ERC20Basic(
            tokenAName,
            tokenASymbol
        );

        string memory tokenBName = string(abi.encodePacked("PredictionGameTokenB", Strings.toString(predictionGameCount)));
        string memory tokenBSymbol = string(abi.encodePacked("B", Strings.toString(predictionGameCount)));
        ERC20Basic TokenB = new ERC20Basic(
            tokenBName,
            tokenBSymbol
        );

        // 2. Create new `PredictionGame` smart contract
        PredictionGame newPredictionGame = gameFactory.createGameContract(
            msg.sender,
            payload.expiryDate,
            address(TokenA),
            address(TokenB),
            payload.betTitle,
            payload.choiceA,
            payload.choiceB
        );
        address newPredictionGameAddr = address(newPredictionGame);
        predictionMarketRegistry[predictionGameCount] = newPredictionGameAddr;
        // Transfer ownership of the tokens to the game
        TokenA.transferOwnership(newPredictionGameAddr);
        TokenB.transferOwnership(newPredictionGameAddr);

        emit PredictionGameCreated(
            predictionGameCount,
            msg.sender,
            newPredictionGameAddr,
            address(TokenA),
            address(TokenB)
        );

        // 3. Increase Prediction Game Counter
        predictionGameCount = SafeMath.add(predictionGameCount, 1);
    }

    function getChainLinkAddress()
        external view
        returns(address addr)
    {
        return (chainLinkAddress);
    }
}