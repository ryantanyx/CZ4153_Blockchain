const PredictionMarket = artifacts.require("PredictionMarket");
const PredictionGame = artifacts.require("PredictionGame");

module.exports = async callback => {
    const ins = await PredictionMarket.at('0x0438435bA324ba51dcfEeCc0d3a420D592fa17dD')     // Put address here
    console.log("Getting contract address: ", ins.address);
    const myE = {A:0, B:1}; 
    const pl = {sideADetails:"test A", sideBDetails: "testB", expiryTime: 1665899999, chosenSide : myE.A}; 
    const msg = {from: "0xbE4874f8D8dB230ebBDEA9d720772FF9a40DE493", value: web3.utils.toWei('0.12')};
    ins.createGame(pl, msg)
    
    ins.predictionMarketRegistry(0)		// use this address for next line, shouldnt be all zeros
    game = await PredictionGame.at('0x6515B25dC446746B33e42B7dbB7739E13dDAF6cc')	// See above in-line comment 
    
    game.placeBet(myE.A, { value: 10000000000000000000 })
    game.getBettingGameInfo()
    
    callback(console.log("Function call completed..."));

};