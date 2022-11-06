const PredictionMarket = artifacts.require("PredictionMarket");
const PredictionGame = artifacts.require("PredictionGame");
const web3 = require("web3");

module.exports = async callback => {
    const ins = await PredictionMarket.deployed()     // Put address here
    console.log("Getting contract address: ", ins.address);
    const newPayload = {
        betTitle : "Test title",
        expiryDate :  1668265200,
        choiceA : "Side A",
        choiceB : "Side B",
        sportId : "11", 
        gameId : "0"
    }
    await ins.createGame(newPayload);
    
    var addr = await ins.predictionMarketRegistry(0)		// use this address for next line, shouldnt be all zeros
    console.log(addr);
    game = await PredictionGame.at(addr)
    console.log(game.address)
    
    callback(console.log("Function call completed..."));

};