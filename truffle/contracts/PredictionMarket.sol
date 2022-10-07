pragma solidity ^0.8.14;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PredictionGame.sol";
import "./interfaces/IERC20Burnable.sol";
import "./enums/Side.sol";

contract PredictionMarket is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Burnable;

    // enum Side { A, B }

    event PredictionGameCreated(
        uint256 predictionGameId,
        address creator,
        Side sides,
        address predictionGameAddress
    );

    address public nativeTokenAddress;
    // address public priceConverterAddress;
    // address internal vrfCoordinatorAddress;
    // address internal linkTokenAddress;
    // bytes32 internal keyHash;
    // uint256 internal fee;
    uint256 private predictionGameCount;
    mapping(uint256 => address) public predictionMarketRegistry;

    constructor(
        address _nativeTokenAddress
    ) {
        nativeTokenAddress = _nativeTokenAddress;
        predictionGameCount = 0;
    }

    /**
     * Making sure that the `_predictionGameId` is valid
     */
    modifier onlyExistingGame(uint256 _predictionGameId) {
        require(_predictionGameId < predictionGameCount);
        _;
    }

    /**
     * Get Prediction Game Address by `predictionGameId`
     */
    function getPredictionGameById(uint256 _predictionGameId) public view returns (address)
    {
        return predictionMarketRegistry[_predictionGameId];
    }

    /**
     * Set Native Token Address (only owner access)
     */
    function setNativeTokenAddress(address newNativeTokenAddress) public onlyOwner
    {
        nativeTokenAddress = newNativeTokenAddress;
    }

    /**
     * Create new `PredictionGame` instance
     */
    function createGame(uint256 value, Side _side) public {
        // 1. Burn some token
        // IERC20Burnable nativeToken = IERC20Burnable(nativeTokenAddress);
        // uint256 burnPrice = SafeMath.mul(0.01 * 10**18, value);        // how to determine the amt creator puts in
        // nativeToken.burnFrom(msg.sender, burnPrice);

        // 2. Create new `PredictionGame` smart contract
        PredictionGame newPredictionGame = new PredictionGame(
            msg.sender,
            _side,
            nativeTokenAddress
        );
        predictionMarketRegistry[predictionGameCount] = address(newPredictionGame);

        emit PredictionGameCreated(
            predictionGameCount,
            msg.sender,
            _side,
            address(newPredictionGame)
        );

        // 3. Increase Prediction Game Counter
        predictionGameCount = SafeMath.add(predictionGameCount, 1);
    }
}