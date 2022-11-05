const PredictionMarket = artifacts.require("PredictionMarket");
const PredictionGame = artifacts.require("PredictionGame");
const web3 = require("web3");

module.exports = async callback => {
    const ins = await PredictionMarket.at('0x548aA995A687b4DDc018346c7392a0e0a3c1DF14')     // Put address here
    console.log("Getting contract address: ", ins.address);
    const newPayload = {betTitle : "Test title", expiryDate : 1666842400, choiceA: "test A", choiceB : "test B"};
    const msg = {from: "0xbE4874f8D8dB230ebBDEA9d720772FF9a40DE493"};
    await ins.createGame(newPayload, msg);
    
    var addr = await ins.predictionMarketRegistry(0)		// use this address for next line, shouldnt be all zeros
    console.log(addr);
    game = await PredictionGame.at(addr)
    console.log(game.address)
    
    callback(console.log("Function call completed..."));

};