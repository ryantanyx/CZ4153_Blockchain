// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import '../node_modules/@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract APIConsumer is ChainlinkClient {
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
    
    uint256 public volume;
    bytes32 private jobId;
    uint256 private fee;


     constructor() {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0xB9756312523826A566e222a34793E414A81c88E1);
    }
    // constructor() {
    //     setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
    //     setChainlinkOracle(0xfF07C97631Ff3bAb5e5e5660Cdf47AdEd8D4d4Fd);
    //     jobId = '491c282eb8b7451699855992d686a20b';
    //     fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    // }


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
    }

    /**
     * @notice Returns an array of game data for a given market, sport ID, and date.
     * @dev Result format is array of either encoded GameCreate tuples or encoded GameResolve tuples.
     * @param _specId the jobID.
     * @param _payment the LINK amount in Juels (i.e. 10^18 aka 1 LINK).
     * @param _market the type of game data to be queried ("create" or "resolve").
     * @param _sportId the ID of the sport to be queried (see supported sportId).
     * @param _date the date for the games to be queried (format in epoch).
     */
    function requestGames(
        bytes32 _specId,
        uint256 _payment,
        string calldata _market,
        uint256 _sportId,
        uint256 _date
    ) external {
        Chainlink.Request memory req = buildOperatorRequest(_specId, this.fulfillGames.selector);

        req.addUint("date", _date);
        req.add("market", _market);
        req.addUint("sportId", _sportId);

        sendOperatorRequest(req, _payment);
    }

    /**
     * @notice Returns an Array of game data for a given market, sport ID, date and other filters.
     * @dev Result format is array of either encoded GameCreate tuples or encoded GameResolve tuples.
     * @dev "gameIds" is optional.
     * @dev "statusIds" is optional, and ignored for market "create".
     * @param _specId the jobID.
     * @param _payment the LINK amount in Juels (i.e. 10^18 aka 1 LINK).
     * @param _market the type of game data to be queried ("create" or "resolve").
     * @param _sportId the ID of the sport to be queried (see supported sportId).
     * @param _date the date for the games to be queried (format in epoch).
     * @param _gameIds the IDs of the games to be queried (array of game ID as its string representation, e.g.
     * ["23660869053591173981da79133fe4c2", "fb78cede8c9aa942b2569b048e649a3f"]).
     * @param _statusIds the IDs of the statuses to be queried (an array of statusId, e.g. ["1","2","3"],
     * see supported statusIds).
     */
    function requestGamesFiltering(
        bytes32 _specId,
        uint256 _payment,
        string calldata _market,
        uint256 _sportId,
        uint256 _date,
        bytes32[] memory _gameIds,
        uint256[] memory _statusIds
    ) external {
        Chainlink.Request memory req = buildOperatorRequest(_specId, this.fulfillGames.selector);

        req.add("market", _market);
        req.addUint("sportId", _sportId);
        req.addUint("date", _date);
        req.addStringArray("gameIds", _bytes32ArrayToString(_gameIds)); // NB: optional filter
        // _addUintArray(req, "statusIds", _statusIds); // NB: optional filter, ignored for market "create".

        req.addStringArray("statusIds", _intArrayToString(_statusIds));
        sendOperatorRequest(req, _payment);
    }

    function withdrawLink(address payable _payee, uint256 _amount) external {
        LinkTokenInterface linkToken = LinkTokenInterface(chainlinkTokenAddress());
        if (!linkToken.transfer(_payee, _amount)) {
            revert FailedTransferLINK(_payee, _amount);
        }
    }

    /* ========== EXTERNAL VIEW FUNCTIONS ========== */

    function getGamesCreated(bytes32 _requestId, uint256 _idx) external view returns (GameCreate memory) {
        GameCreate memory game = abi.decode(requestIdGames[_requestId][_idx], (GameCreate));
        return game;
    }

    function getGamesResolved(bytes32 _requestId, uint256 _idx) external view returns (GameResolve memory) {
        GameResolve memory game = abi.decode(requestIdGames[_requestId][_idx], (GameResolve));
        return game;
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

    // function _addUintArray(
    //     Chainlink.Request memory _req,
    //     string memory _key,
    //     uint256[] memory _values
    // ) private pure {
    //     Chainlink.Request memory r2 = _req;
    //     r2.buf.encodeString(_key);
    //     r2.buf.startArray();
    //     uint256 valuesLength = _values.length;
    //     for (uint256 i = 0; i < valuesLength; ) {
    //         r2.buf.encodeUInt(_values[i]);
    //         unchecked {
    //             ++i;
    //         }
    //     }
    //     r2.buf.endSequence();
    //     _req = r2;
    // }

    function _intArrayToString(uint256[] memory _intArray) private pure returns (string[] memory) {
        string[] memory gameIds = new string[](_intArray.length);
        for (uint256 i = 0; i < _intArray.length; i++) {
            gameIds[i] = Strings.toString(_intArray[i]);
        }
        return gameIds;
    }

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