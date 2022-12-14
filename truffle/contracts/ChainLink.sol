// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import '../node_modules/@chainlink/contracts/src/v0.8/ChainlinkClient.sol';

contract ChainLinkAPIConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    struct GameCreate {
        bytes32 gameId;
        uint256 startTime;
        string homeTeam;
        string awayTeam;
    }

    struct GameResolve {
        bytes32 gameId;
        uint8 homeScore;
        uint8 awayScore;
        uint8 statusId;
    }
    mapping(bytes32 => bytes[]) public requestIdGames;

    error FailedTransferLINK(address to, uint256 amount);
    bytes32 private immutable jobId;
    uint256 private immutable fee;
    mapping(bytes32 => bool) public isFulfilled;

    constructor(
        address _oracle,
        bytes32 _jobId,
        uint256 _fee,
        address _link
    ) {
        if (_link == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(_link);
        }
        setChainlinkOracle(_oracle);
        jobId = _jobId;
        fee = _fee;
    }

    /* ========== EXTERNAL FUNCTIONS ========== */

    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) external {
        cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
    }

    function fulfillGames(bytes32 _requestId, bytes[] memory _games) external recordChainlinkFulfillment(_requestId) {
        requestIdGames[_requestId] = _games;
        isFulfilled[_requestId] = true;
    }

    /**
     * @notice Returns an array of game data for a given market, sport ID, and date.
     * @dev Result format is array of either encoded GameCreate tuples or encoded GameResolve tuples.
     * @param _market the type of game data to be queried ("create" or "resolve").
     * @param _sportId the ID of the sport to be queried (see supported sportId).
     * @param _date the date for the games to be queried (format in epoch).
     */
    function requestGames(
        string calldata _market,
        uint256 _sportId,
        uint256 _date
    ) external returns (bytes32 requestId){
        Chainlink.Request memory req = buildOperatorRequest(jobId, this.fulfillGames.selector);

        req.addUint("date", _date);
        req.add("market", _market);
        req.addUint("sportId", _sportId);
        return sendOperatorRequestTo(chainlinkOracleAddress() ,req, fee);
    }

    /**
     * @notice Returns an Array of game data for a given market, sport ID, date and other filters.
     * @dev Result format is array of either encoded GameCreate tuples or encoded GameResolve tuples.
     * @dev "gameIds" is optional.
     * @dev "statusIds" is optional, and ignored for market "create".
     * @param _market the type of game data to be queried ("create" or "resolve").
     * @param _sportId the ID of the sport to be queried (see supported sportId).
     * @param _date the date for the games to be queried (format in epoch).
     * @param _gameIds the IDs of the games to be queried (array of game ID as its string representation, e.g.
     * ["23660869053591173981da79133fe4c2", "fb78cede8c9aa942b2569b048e649a3f"]).
     */
    function requestSpecificGames(
        string calldata _market,
        uint256 _sportId,
        uint256 _date,
        bytes32[] memory _gameIds
    ) external {
        Chainlink.Request memory req = buildOperatorRequest(jobId, this.fulfillGames.selector);

        req.add("market", _market);
        req.addUint("sportId", _sportId);
        req.addUint("date", _date);
        req.addStringArray("gameIds", _bytes32ArrayToString(_gameIds)); // NB: optional filter
        sendOperatorRequest(req, fee);
    }

    function withdrawLink(address payable _payee, uint256 _amount) external {
        LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
        if (!linkToken.transfer(_payee, _amount)) {
            revert FailedTransferLINK(_payee, _amount);
        }
    }

    /* ========== EXTERNAL VIEW FUNCTIONS ========== */

    function getGamesCreated(bytes32 _requestId) external view returns (GameCreate[] memory) {
        
        uint256 tmp = requestIdGames[_requestId].length;
        GameCreate[] memory games = new GameCreate[](tmp);
        for (uint i = 0; i < tmp; i++){
            GameCreate memory game = abi.decode(requestIdGames[_requestId][i], (GameCreate));
            games[i] = game;
        }
        return games;
    }

    function getGamesResolved(bytes32 _requestId) external view returns (GameResolve[] memory) {
        
        uint256 tmp = requestIdGames[_requestId].length;
        GameResolve[] memory games = new GameResolve[](tmp);
        for (uint i = 0; i < tmp; i++){
            GameResolve memory game = abi.decode(requestIdGames[_requestId][i], (GameResolve));
            games[i] = game;
        }
        return games;
    }

    function getOracleAddress() external view returns (address) {
        return chainlinkOracleAddress();
    }

    /* ========== PRIVATE PURE FUNCTIONS ========== */

    function _bytes32ArrayToString(bytes32[] memory _bytes32Array) private pure returns (string[] memory) {
        string[] memory gameIds = new string[](_bytes32Array.length);
        for (uint256 i = 0; i < _bytes32Array.length; i++) {
            gameIds[i] = _bytes32ToString(_bytes32Array[i]);
        }
        return gameIds;
    }

    function _bytes32ToString(bytes32 _bytes32) private pure returns (string memory) {
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}