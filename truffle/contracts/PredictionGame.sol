// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC20Basic.sol";
import "./enums/Side.sol";

contract PredictionGame{ //is VRFConsumerBase {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    enum PredictionGameStatus { OPEN, CLOSED }
    enum sides {A, B}

    event Challenge(address challenger);
    event Play(address playerAddress, uint256 randomResult);
    event Deposit(address tokenAddress, uint256 tokenAmount);
    event Withdraw(address winner, address tokenAddress, uint256 tokenAmount);

    string public betTitle;
    string[] choices;
    uint256 private K; //CPMM invariant

    address public creator;
    // Side public sides;
    PredictionGameStatus public status;
    uint256 public expiryTime;
    address public TokenAAddress;
    address public TokenBAddress;
    // address public depositTokenAddress;
    // address priceConverterAddress;
    // address public winner;
    // bool public isWithdrawn;
    // Result public result;

    mapping(string => sides) public sidesMap;
    mapping(sides => uint256) public bets;
    mapping(bytes32 => address) requestIdToAddressRegistry;
    mapping(address => mapping(sides => uint256)) public betsOfAllPlayers;
    mapping(sides => uint) internalTokenCounts;

    constructor(
        // address _vrfCoordinatorAddress,
        // address _linkTokenAddress,
        // bytes32 _keyHash,
        // uint256 _fee,
        address _creator,
        uint256 _expiryTime,
        address _TokenAAddress,
        address _TokenBAddress,
        // address _priceConverterAddress
        string memory _betTitle,
        string memory _choiceA,
        string memory _choiceB
    ){
        creator = _creator;
        //sides = _sides;
        status = PredictionGameStatus.OPEN;
        expiryTime = _expiryTime;
        TokenAAddress = _TokenAAddress;
        TokenBAddress = _TokenBAddress;
        betTitle = _betTitle;
        sidesMap[_choiceA] = sides.A;
        choices.push(_choiceA);
        sidesMap[_choiceB] = sides.B;
        choices.push(_choiceB);
        // priceConverterAddress = _priceConverterAddress;
        // depositTokenAddress = address(0);
        internalTokenCounts[sides.A] = 0;
        internalTokenCounts[sides.B] = 0;
    }

    /**
     * Making sure that `_msgSend` is either a creator or not (depends `isEqual`)
     */
    modifier onlyCreator(bool isEqual) {
        if (isEqual) {
            require(creator == msg.sender, "You are not the creator of this game!");
        } else {
            require(creator != msg.sender, "You are the creator of this game!");
        }
        _;
    }

    /**
     * Making sure that this game has either expired or not (depends on `isExpired`)
     */
    modifier onlyExpiredGame(bool isExpired) {
        // Update PredictionGameStatus to CLOSED if expiryTime is reached
        if (block.timestamp >= expiryTime) {
            status = PredictionGameStatus.CLOSED;
        }

        if (isExpired) {
            require(status == PredictionGameStatus.CLOSED, 
                "This game has not expired!"
            );
        } else {
            require(block.timestamp < expiryTime && status == PredictionGameStatus.OPEN, 
                "This game has expired!"
            );
        }
        _;
    }

    // modifier onlyNotWithdrawn() {
    //     require(isWithdrawn == false, "The fund in this game has been withdrawn!");
    //     _;
    // }

    /**
     * Making sure that the function has only access to the winner
     */
    // modifier onlyWinner() {
    //     require(msg.sender == winner, "You are not the winner of this game!");
    //     _;
    // }

    /**
     * Print choices in game
     */
    function getChoices()
        public
        view
        returns (
            string[] memory entries
        )
    {
        return (
            choices
        );
    }

    function provideLiquidity()
        public payable
        onlyCreator(true)
    {
        internalTokenCounts[sides.A] = SafeMath.add(internalTokenCounts[sides.A], msg.value);
        internalTokenCounts[sides.B] = SafeMath.add(internalTokenCounts[sides.B], msg.value);
        K = SafeMath.mul(internalTokenCounts[sides.A], internalTokenCounts[sides.B]);

        // Mint the tokens
        ERC20Basic tokenA = ERC20Basic(TokenAAddress);
        ERC20Basic tokenB = ERC20Basic(TokenBAddress);
        tokenA.mint(address(this), msg.value);
        tokenB.mint(address(this), msg.value);
    }

    function seeInternalTokensA()
        public
        view
        returns (
            uint
        )
    {
        return internalTokenCounts[sides.A];
    }

    function seeInternalTokensB()
        public
        view
        returns (
            uint
        )
    {
        return internalTokenCounts[sides.B];
    }

    /**
     * Get Betting Game all public info
     */
    function getBettingGameInfo()
        public
        view
        returns (
            address,
            // address,
            // Side,
            PredictionGameStatus,
            uint256
            // Side
            // bool
            // uint256,
            // uint256
        )
    {
        return (
            creator,
            // challenger,
            // sides,
            status,
            expiryTime
            // result.winner
            // isWithdrawn
            // playerPredictionRecordRegistry[creator], //supposed to return 
            // playerPredictionRecordRegistry[challenger]
        );
    }

    // function challenge(Side _side)
    //     public
    //     onlyCreator(false)
    //     onlyExpiredGame(false)
    // {
    //     IERC20Burnable nativeToken = IERC20Burnable(nativeTokenAddress);
    //     uint256 burnPrice = SafeMath.mul(0.01 * 10**18, betsOfAllPlayers[msg.sender][_side]);
    //     nativeToken.burnFrom(msg.sender, burnPrice);

    //     challenger = msg.sender;

    //     emit Challenge(msg.sender);
    // }

    /**
     *  Cancel the created Betting Game
     */
    function cancel() public onlyCreator(true) {
        status = PredictionGameStatus.CLOSED;
    }

    /**
     * Allow player to place a bet on the game
     */
    function placeBet(string memory choice)
        public payable
        onlyExpiredGame(false)
    {   
        sides side = sidesMap[choice];
        bets[side] = SafeMath.add(bets[side], msg.value);                               // Update the bet value on that side
        betsOfAllPlayers[msg.sender][side] = SafeMath.add(betsOfAllPlayers[msg.sender][side], msg.value);       // Update the bet value for the player

        //call CPMM
        uint togive = CPMM(msg.value, side);
        
        // Mint the tokens
        ERC20Basic tokenA = ERC20Basic(TokenAAddress);
        ERC20Basic tokenB = ERC20Basic(TokenBAddress);
        tokenA.mint(address(this), msg.value);
        tokenB.mint(address(this), msg.value);

        // Transfer the appropriate amount of tokens to the player

    }

    function seeGame()
        public view
        returns(
            string memory,
            uint256,
            string memory,
            uint256,
            string memory,
            uint256
        )
    {
        return (
            betTitle,
            expiryTime,
            choices[0],
            bets[sides.A],
            choices[1],
            bets[sides.B]
        );
    }

    // constant product market maker
    function CPMM(uint value, sides betSide)
        private
        returns (uint)
    {
        uint togive;
        internalTokenCounts[sides.A] = SafeMath.add(internalTokenCounts[sides.A], value);
        internalTokenCounts[sides.B] = SafeMath.add(internalTokenCounts[sides.B], value);
        uint newProduct = SafeMath.mul(internalTokenCounts[sides.A], internalTokenCounts[sides.B]);

        if (betSide == sides.A) {
            togive = SafeMath.div(SafeMath.sub(newProduct, K), internalTokenCounts[sides.B]);
            internalTokenCounts[sides.A] = SafeMath.sub(internalTokenCounts[sides.A], togive);
        }
        else {
            togive = SafeMath.div(SafeMath.sub(newProduct, K), internalTokenCounts[sides.A]);
            internalTokenCounts[sides.B] = SafeMath.sub(internalTokenCounts[sides.B], togive);
        }

        return togive;
    }

    // function deposit(
    //     address _tokenAddress
    //     // address _baseAddress,
    //     // address _quoteAddress
    // ) public onlyExpiredGame(false) {

    //     IERC20 token = IERC20(_tokenAddress);
    //     // How to derive the token amount???
    //     // uint256 tokenAmount = SafeMath.div(SafeMath.mul(uint256(price), betsOfAllPlayers[msg.sender][_side]), 100);
    //     token.safeTransferFrom(msg.sender, address(this), 0);

    //     if (depositTokenAddress == address(0)) {
    //         depositTokenAddress = _tokenAddress;
    //     }

    //     emit Deposit(_tokenAddress, 0);
    // }

    // function withdraw()
    //     public
    //     onlyExpiredGame(true)
    //     // onlyWinner
    //     onlyNotWithdrawn
    // {
    //     uint gamblerBet = betsOfAllPlayers[msg.sender][result.winner];
    //     require(gamblerBet > 0, "You did not bet on this side!");
    //     uint gain = gamblerBet + bets[result.loser] * gamblerBet / bets[result.winner];
    //     betsOfAllPlayers[msg.sender][Side.A] = 0;
    //     betsOfAllPlayers[msg.sender][Side.B] = 0;
    //     // msg.sender.transfer(gain);

    //     IERC20 token = IERC20(depositTokenAddress);
    //     uint256 tokenAmount = token.balanceOf(address(this));
    //     token.safeTransfer(msg.sender, tokenAmount);

    //     emit Withdraw(msg.sender, depositTokenAddress, 0);

    //     isWithdrawn = true;
    // }
}