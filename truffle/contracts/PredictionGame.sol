// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ChainLink.sol";
import "./InternalToken.sol";
import "./ERC20Basic.sol";
import "./enums/Side.sol";
import "./SharedStructs.sol";

contract PredictionGame{
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    enum PredictionGameStatus { OPEN, CLOSED }

    event Challenge(address challenger);
    event Play(address playerAddress, uint256 randomResult);
    event Deposit(address tokenAddress, uint256 tokenAmount);
    event Withdraw(address winner, address tokenAddress, uint256 tokenAmount);

    string public betTitle;
    string[] public choices;
    
    uint256 public totalPot;
    uint256 private excess;
    string public winner;
    string public sportId;
    string public gameId;
    bool public liquidityInitialised;

    address public creator;
    PredictionGameStatus public status;
    uint256 public expiryTime;
    ERC20Basic public tokenA;
    ERC20Basic public tokenB;
    InternalToken internalToken;
    string private reqId;
    address chainLinkAddr;
    uint gameTypeId;
    // address public winner;
    // bool public isWithdrawn;
    // Result public result;

    mapping(string => Side) public sidesMap;
    mapping(Side => uint256) public bets;
    mapping(bytes32 => address) requestIdToAddressRegistry;
    mapping(address => mapping(Side => uint256)) public betsOfAllPlayers;

    mapping(Side => uint256) externalTokens;


    constructor(
        address _creator,
        // uint256 _expiryTime,
        address _TokenAAddress,
        address _TokenBAddress,
        // string memory _betTitle,
        // string memory _choiceA,     // Home Team
        // string memory _choiceB,     // Away Team,
        // string memory _sportId,
        // string memory _gameId,
        SharedStructs.Payload memory _payload
        // string memory _reqId,
        // address _chainLinkAddr,
        // uint _gameTypeId
    ){
        creator = _creator;
        status = PredictionGameStatus.OPEN;
        expiryTime = _payload.expiryDate;
        tokenA = ERC20Basic(_TokenAAddress);
        tokenB = ERC20Basic(_TokenBAddress);
        betTitle = _payload.betTitle;
        sidesMap[_payload.choiceA] = Side.YES;
        choices.push(_payload.choiceA);
        sidesMap[_payload.choiceB] = Side.NO;
        choices.push(_payload.choiceB);
        internalToken = new InternalToken(0, address(this));
        externalTokens[Side.YES] = 0;
        externalTokens[Side.NO] = 0;
        totalPot = 0;
        liquidityInitialised = false;
        excess = 0;
        // reqId = _reqId;

        // Initialization for ChainLink
        winner = "";
        sportId = _payload.sportId;
        gameId = _payload.gameId;
        // chainLinkAddr = _chainLinkAddr;
        // gameTypeId  = _gameTypeId;
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
            require(status == PredictionGameStatus.OPEN, //block.timestamp < expiryTime && , 
                "This game has expired!"
            );
        }
        _;
    }

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
    // function getChoices()
    //     public
    //     view
    //     returns (
    //         string[] memory entries
    //     )
    // {
    //     return (
    //         choices
    //     );
    // }

    function provideLiquidity()
        external payable
        onlyExpiredGame(false)
    {
        require(liquidityInitialised == false, "Liquidity already initialised");
        require(creator == msg.sender, "You are not the creator of this game!");
        liquidityInitialised = true;
        internalToken.setValue(msg.value);

        // Mint the tokens
        tokenA.mint(address(this), msg.value);
        tokenB.mint(address(this), msg.value);

        //update pot and lp's share (2% fees)
        totalPot = SafeMath.div(SafeMath.mul(address(this).balance, 98), 100);
        excess = SafeMath.sub(address(this).balance, totalPot);
    }

    // function seeBalance()
    //     external
    //     view
    //     returns (
    //         uint
    //     )
    // {
    //     return address(this).balance;
    // }

    // Pass in side of which Internal Tokens you wish to query
    function seeInternalTokens(Side side)
        external
        view
        returns (
            uint
        )
    {
        return internalToken.seeInternalTokens(side);
    }

    function withdrawWinnings()
        external
        payable
        onlyExpiredGame(true)
    {   
        require(betsOfAllPlayers[msg.sender][sidesMap[winner]] > 0); // check player has placed bets on winning side and hasn't withdrawn

        uint winTokens = 0;
        uint winTokensTotal = 0;

        if (sidesMap[winner] == Side.YES) {
            winTokens = tokenA.balanceOf(msg.sender);
            winTokensTotal = externalTokens[Side.YES];
        }
        else {
            winTokens = tokenB.balanceOf(msg.sender);
            winTokensTotal = externalTokens[Side.NO];
        }

        // calc % winnings
        // let a = amt of winning tokens sender holds, b = amt of total winning tokens issued, c = totalPot
        // proportion of winning share D = a / b
        // proportion of pot = E = D * c

        uint256 potShare = SafeMath.div(SafeMath.mul(SafeMath.div(SafeMath.mul(winTokens, 10**18), winTokensTotal), totalPot), 10**18);

        payable(msg.sender).transfer(potShare);

        betsOfAllPlayers[msg.sender][sidesMap[winner]] = 0;  //signal player has already withdrawn
    }

    function withdrawLiquidity()
        external
        payable
        onlyExpiredGame(true)
    {
        require(creator == msg.sender, "You are not the creator of this game!");
        require(excess > 0, "Liquidity provider's share has already been withdrawn!");

        payable(msg.sender).transfer(excess);
        
        excess = 0; //signal lp has already withdrawn
    }

    /**
     * Get Betting Game all public info
     */
    // function getBettingGameInfo()
    //     public
    //     view
    //     returns (
    //         address,
    //         // address,
    //         // Side,
    //         PredictionGameStatus,
    //         uint256
    //         // Side
    //         // bool
    //         // uint256,
    //         // uint256
    //     )
    // {
    //     return (
    //         creator,
    //         // challenger,
    //         // sides,
    //         status,
    //         expiryTime
    //         // result.winner
    //         // isWithdrawn
    //         // playerPredictionRecordRegistry[creator], //supposed to return 
    //         // playerPredictionRecordRegistry[challenger]
    //     );
    // }


    /**
     *  Cancel the created Betting Game
     */
    // function cancel() public onlyCreator(true) {
    //     status = PredictionGameStatus.CLOSED;
    // }

    /**
     * Allow player to place a bet on the game
     */
    function placeBet(string memory choice)
        external payable
        onlyExpiredGame(false)
    {   
        Side side = sidesMap[choice];
        bets[side] = SafeMath.add(bets[side], msg.value);                               // Update the bet value on that side
        betsOfAllPlayers[msg.sender][side] = SafeMath.add(betsOfAllPlayers[msg.sender][side], msg.value);       // Update the bet value for the player
        totalPot = SafeMath.add(totalPot, SafeMath.div(SafeMath.mul(msg.value, 98), 100)); //update pot
        excess = SafeMath.sub(address(this).balance, totalPot); //total lp's share
        
        // Mint the tokens

        tokenA.mint(address(this), msg.value);
        tokenB.mint(address(this), msg.value);

        //call CPMM
        uint togive = internalToken.CPMM(msg.value, side);

        // Transfer the appropriate amount of tokens to the player
        if (side == Side.YES){
            tokenA.transfer(msg.sender, togive);
            externalTokens[Side.YES] = SafeMath.add(externalTokens[Side.YES], togive);
        }
        else{
            tokenB.transfer(msg.sender, togive);
            externalTokens[Side.YES] = SafeMath.add(externalTokens[Side.NO], togive);
        }
    }

    function seeGame()
        external view
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
            bets[Side.YES],
            choices[1],
            bets[Side.NO]
        );
    }

    function updateWinner(string memory _winner) 
        external onlyExpiredGame(true){
            winner = _winner;
    }
    
}