pragma solidity ^0.8.14;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "../node_modules/@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "./interfaces/IERC20Burnable.sol";
import "./ERC20Basic.sol";
import "./enums/Side.sol";

contract PredictionGame{ //is VRFConsumerBase {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    enum PredictionGameStatus { OPEN, CLOSED }

    struct Result {
        SideEnum winner;
        SideEnum loser;
    }

    event Challenge(address challenger);
    event Play(address playerAddress, uint256 randomResult);
    event Deposit(address tokenAddress, uint256 tokenAmount);
    event Withdraw(address winner, address tokenAddress, uint256 tokenAmount);
    event TokenCreated(uint256 value);

    bytes32 internal keyHash;
    uint256 internal fee;
    address public creator;
    address public challenger;
    // Side[2] public sides;
    PredictionGameStatus public status;
    uint256 public expiryTime;
    uint256 public createdTime;
    address public nativeTokenAddress;
    address public depositTokenAddress; // I think not required.
    // address priceConverterAddress;
    // address public winner;
    bool public isWithdrawn;
    Result public result;
    ERC20Basic tokenA;
    ERC20Basic tokenB;
    uint256 private balance;

    mapping(SideEnum => uint256) tokenValues;
    mapping(SideEnum => string) sideDetails;
    mapping(SideEnum => uint) public bets;
    mapping(bytes32 => address) requestIdToAddressRegistry;
    mapping(address => mapping(SideEnum => uint256)) public betsOfAllPlayers; // need to change to nested mapping?

    constructor(
        // address _vrfCoordinatorAddress,
        // address _linkTokenAddress,
        // bytes32 _keyHash,
        // uint256 _fee,
        address _creator,
        string memory _sideA,
        string memory _sideB,
        uint256 _expiryTime,
        // uint _value,
        // SideEnum _chosenSide,
        address _nativeTokenAddress
        // address _priceConverterAddress
    ){
        // createTokens(_value);
        // placeBet(_chosenSide, creator, _value);
        // balance = _valuse;
        creator = _creator;
        challenger = address(0);
        sideDetails[SideEnum.A] = _sideA;
        sideDetails[SideEnum.B] = _sideB;
        status = PredictionGameStatus.OPEN;
        expiryTime = _expiryTime;
        createdTime = block.timestamp;
        nativeTokenAddress = _nativeTokenAddress;
        depositTokenAddress = address(0);
        
        // keyHash = _keyHash;
        // fee = _fee;
        // priceConverterAddress = _priceConverterAddress;
        
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
        if (isExpired) {
            require(block.timestamp >= expiryTime || status == PredictionGameStatus.CLOSED, 
                "This game has not expired!"
            );
        } else {
            require(block.timestamp < expiryTime && status == PredictionGameStatus.OPEN, 
                "This game has expired!"
            );
        }
        _;
    }

    modifier onlyNotWithdrawn() {
        require(isWithdrawn == false, "The fund in this game has been withdrawn!");
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
     * Get Prediction Game all public info
     */
    function getBettingGameInfo()
        public
        view
        returns (
            address,
            // address,
            string memory,
            string memory,
            PredictionGameStatus,
            uint256,
            uint256,
            uint256,
            uint256,
            // address,
            SideEnum,
            bool
        )
    {
        return (
            creator,
            // challenger,
            sideDetails[SideEnum.A],
            sideDetails[SideEnum.B],
            status,
            expiryTime,
            tokenValues[SideEnum.A],
            betsOfAllPlayers[creator][SideEnum.A],
            betsOfAllPlayers[creator][SideEnum.B],
            // depositTokenAddress,
            result.winner,
            isWithdrawn
            // playerPredictionRecordRegistry[creator], //supposed to return 
            // playerPredictionRecordRegistry[challenger]
        );
    }

    function getBetsOfAllPlayers(address _address) public view
        returns (uint256, uint256) {
        return (
            betsOfAllPlayers[_address][SideEnum.A],
            betsOfAllPlayers[_address][SideEnum.B]
        );
    }

    function challenge(SideEnum _side)
        public
        onlyCreator(false)
        onlyExpiredGame(false)
    {
        IERC20Burnable nativeToken = IERC20Burnable(nativeTokenAddress);
        uint256 burnPrice = SafeMath.mul(0.01 * 10**18, betsOfAllPlayers[msg.sender][_side]);
        nativeToken.burnFrom(msg.sender, burnPrice);

        challenger = msg.sender;

        emit Challenge(msg.sender);
    }

    /**
     *  Cancel the created Betting Game
     */
    function cancel() public onlyCreator(true) {
        status = PredictionGameStatus.CLOSED;
    }

    /**
     * Allow player `_msgSend` to place a bet on the game
     */
     
    function placeBet(SideEnum _side)
        public payable
        onlyExpiredGame(false)
    {
        // require(
        //     LINK.balanceOf(address(this)) >= fee,
        //     "Not enough LINK - fill contract with faucet"
        // );
        // requestId = requestRandomness(keyHash, fee);
        // requestIdToAddressRegistry[requestId] = msg.sender;
        balance += msg.value;

        bets[_side] += msg.value;
        betsOfAllPlayers[msg.sender][_side] += msg.value;   
    }

    function createTokens() public payable {
        tokenValues[SideEnum.A] += msg.value;
        tokenValues[SideEnum.B] += msg.value;
        emit TokenCreated(msg.value);
    }

    function placeBet(SideEnum _side, address _sender, uint256 _value)
        public 
        onlyExpiredGame(false)
    {
        balance += _value;

        bets[_side] += _value;
        betsOfAllPlayers[_sender][_side] += _value;
        
    }


    function deposit(
        address _tokenAddress
        // address _baseAddress,
        // address _quoteAddress
    ) public onlyExpiredGame(false) {

        IERC20 token = IERC20(_tokenAddress);
        // How to derive the token amount???
        // uint256 tokenAmount = SafeMath.div(SafeMath.mul(uint256(price), betsOfAllPlayers[msg.sender][_side]), 100);
        token.safeTransferFrom(msg.sender, address(this), 0);

        if (depositTokenAddress == address(0)) {
            depositTokenAddress = _tokenAddress;
        }

        emit Deposit(_tokenAddress, 0);
    }

    function withdraw()
        public
        onlyExpiredGame(true)
        // onlyWinner
        onlyNotWithdrawn
    {
        uint gamblerBet = betsOfAllPlayers[msg.sender][result.winner];
        require(gamblerBet > 0, "You did not bet on this side!");
        uint gain = gamblerBet + bets[result.loser] * gamblerBet / bets[result.winner];
        betsOfAllPlayers[msg.sender][SideEnum.A] = 0;
        betsOfAllPlayers[msg.sender][SideEnum.B] = 0;
        // msg.sender.transfer(gain);

        IERC20 token = IERC20(depositTokenAddress);
        uint256 tokenAmount = token.balanceOf(address(this));
        token.safeTransfer(msg.sender, tokenAmount);

        emit Withdraw(msg.sender, depositTokenAddress, 0);

        isWithdrawn = true;
    }
}