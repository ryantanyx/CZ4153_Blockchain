const PredictionMarket = artifacts.require("PredictionMarket");
const PredictionGame = artifacts.require("PredictionGame");

module.exports = async callback => {
    const ins = await PredictionMarket.at('0xFDad5cc13Ae642FA0a3521D32A69c31c80E0B2dd')     // Put address here
    console.log("Getting contract address: ", ins.address);
    const newPayload = {betTitle : "Test title", expiryDate : 1666842400, choiceA: "test A", choiceB : "test B"};
    const msg = {from: "0xbE4874f8D8dB230ebBDEA9d720772FF9a40DE493", value: web3.utils.toWei('0.12')};
    ins.createGame(newPayload, msg)
    
    var addr = await ins.predictionMarketRegistry(0)		// use this address for next line, shouldnt be all zeros
    console.log(addr);
    // game = await PredictionGame.at(addr)
    // console.log(game.address)
    
    // game.placeBet(myE.A, { value: 10000000000000000000 })
    // game.getBettingGameInfo()
    
    callback(console.log("Function call completed..."));

};