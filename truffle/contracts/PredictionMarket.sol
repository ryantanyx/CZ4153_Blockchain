pragma solidity ^0.8.14;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PredictionGame.sol";
import "./ERC20Basic.sol";
import "./interfaces/IERC20Burnable.sol";
import "./enums/Side.sol";

contract PredictionMarket is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20 for IERC20Burnable;

    event PredictionGameCreated(
        uint256 predictionGameId,
        address creator,
        Side sides,
        address predictionGameAddress,
        address yesTokenAddress,
        address noTokenAddress
    );

    uint256 private predictionGameCount;
    mapping(uint256 => address) public predictionMarketRegistry;

    constructor(
    ) {
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
     * Create new `PredictionGame` instance
     */
    function createGame(Side _side, uint256 _expiryTime) public {
        // 1. Create the game tokens
        string memory yesTokenName = string(abi.encodePacked("PredictionGameTokenYes", Strings.toString(predictionGameCount)));
        string memory yesTokenSymbol = string(abi.encodePacked("YES", Strings.toString(predictionGameCount)));
        ERC20Basic yesToken = new ERC20Basic(
            yesTokenName,
            yesTokenSymbol
        );

        string memory noTokenName = string(abi.encodePacked("PredictionGameTokenNo", Strings.toString(predictionGameCount)));
        string memory noTokenSymbol = string(abi.encodePacked("NO", Strings.toString(predictionGameCount)));
        ERC20Basic noToken = new ERC20Basic(
            noTokenName,
            noTokenSymbol
        );

        // 2. Create new `PredictionGame` smart contract
        PredictionGame newPredictionGame = new PredictionGame(
            msg.sender,
            _side,
            _expiryTime,
            address(yesToken),
            address(noToken)
        );
        predictionMarketRegistry[predictionGameCount] = address(newPredictionGame);

        emit PredictionGameCreated(
            predictionGameCount,
            msg.sender,
            _side,
            address(newPredictionGame),
            address(yesToken),
            address(noToken)
        );

        // 3. Increase Prediction Game Counter
        predictionGameCount = SafeMath.add(predictionGameCount, 1);
    }
}