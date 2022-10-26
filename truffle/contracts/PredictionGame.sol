pragma solidity ^0.8.14;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "../node_modules/@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
// import "../interfaces/IPriceConverter.sol";
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
    uint256 public totalPot;
    string public winner;

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
    mapping(sides => uint256) internalTokenCounts;
    mapping(sides => uint256) externalTokens;


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
        externalTokens[sides.A] = 0;
        externalTokens[sides.B] = 0;
        totalPot = 0;
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

        //update pot (2% fees)
        totalPot = SafeMath.div(SafeMath.mul(address(this).balance, 98), 100);
    }

    function seeBalance()
        public
        view
        returns (
            uint
        )
    {
        return address(this).balance;
    }

    // function seeInternalTokensA()
    //     public
    //     view
    //     returns (
    //         uint
    //     )
    // {
    //     return internalTokenCounts[sides.A];
    // }

    // function seeInternalTokensB()
    //     public
    //     view
    //     returns (
    //         uint
    //     )
    // {
    //     return internalTokenCounts[sides.B];
    // }

    // function seeK()
    //     public
    //     view
    //     returns (
    //         uint
    //     )
    // {
    //     return K;
    // }

    function testWinner() public {
        winner = 'a';
        externalTokens[sidesMap[winner]] = 300;
    }

    function withdrawWinnings()
        public
        payable
    {   
        require(betsOfAllPlayers[msg.sender][sidesMap[winner]] > 0); // check player has placed bets on winning side and hasn't withdrawn

        uint winTokens = 0;
        uint winTokensTotal = 0;

        if (sidesMap[winner] == sides.A) {
            ERC20Basic tokenA = ERC20Basic(TokenAAddress);
            winTokens = tokenA.balanceOf(msg.sender);
            winTokensTotal = externalTokens[sides.A];
        }
        else {
            ERC20Basic tokenB = ERC20Basic(TokenBAddress);
            winTokens = tokenB.balanceOf(msg.sender);
            winTokensTotal = externalTokens[sides.B];
        }

        // calc % winnings
        // let a = amt of winning tokens sender holds, b = amt of total winning tokens issued, c = totalPot
        // proportion of winning share D = a / b
        // proportion of pot = E = D * c

        uint256 potShare = SafeMath.div(SafeMath.mul(SafeMath.div(SafeMath.mul(winTokens, 10**18), winTokensTotal), totalPot), 10**18);

        payable(msg.sender).transfer(potShare);

        betsOfAllPlayers[msg.sender][sidesMap[winner]] = 0;  //signal player has already withdrawn
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
        public payable
        onlyExpiredGame(false)
    {   
        sides side = sidesMap[choice];
        bets[side] = SafeMath.add(bets[side], msg.value);                               // Update the bet value on that side
        betsOfAllPlayers[msg.sender][side] = SafeMath.add(betsOfAllPlayers[msg.sender][side], msg.value);       // Update the bet value for the player
        totalPot = SafeMath.add(totalPot, SafeMath.div(SafeMath.mul(msg.value, 98), 100)); //update pot
        
        // Mint the tokens
        ERC20Basic tokenA = ERC20Basic(TokenAAddress);
        ERC20Basic tokenB = ERC20Basic(TokenBAddress);
        tokenA.mint(address(this), msg.value);
        tokenB.mint(address(this), msg.value);

        //call CPMM
        uint togive = CPMM(msg.value, side);

        // Transfer the appropriate amount of tokens to the player
        if (side == sides.A){
            tokenA.transfer(msg.sender, togive);
            externalTokens[sides.A] = SafeMath.add(externalTokens[sides.A], togive);
        }
        else{
            tokenB.transfer(msg.sender, togive);
            externalTokens[sides.A] = SafeMath.add(externalTokens[sides.B], togive);
        }
    }

    // function seeGame()
    //     public view
    //     returns(
    //         string memory,
    //         uint256,
    //         string memory,
    //         uint256,
    //         string memory,
    //         uint256
    //     )
    // {
    //     return (
    //         betTitle,
    //         expiryTime,
    //         choices[0],
    //         bets[sides.A],
    //         choices[1],
    //         bets[sides.B]
    //     );
    // }

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

        K = SafeMath.mul(internalTokenCounts[sides.A], internalTokenCounts[sides.B]); //update K in case of division remainders

        return togive;
    }
}