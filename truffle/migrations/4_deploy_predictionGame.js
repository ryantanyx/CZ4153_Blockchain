const PredictionGame = artifacts.require("PredictionGame");
const ERC20Basic = artifacts.require("ERC20Basic");
const { developmentChains } = require("../helper-truffle-config")

module.exports = async function (deployer, network, accounts) {
    if (developmentChains.includes(network)) {
        creator = accounts[0];
        await deployer.deploy(ERC20Basic, "Token A", "TKA");
        const tokenA = await ERC20Basic.deployed()
        await deployer.deploy(ERC20Basic, "Token B", "TKB");
        const tokenB = await ERC20Basic.deployed()
        payload = {
            betTitle : "Test title",
            expiryDate :  1668265200,
            choiceA : "Side A",
            choiceB : "Side B",
            sportId : "11", 
            gameId : "0"
        }
        console.log("Token A: " + tokenA.address + "\nToken B: " + tokenB.address)
        predictionGame = await deployer.deploy(PredictionGame, creator, tokenA.address, tokenB.address, payload)
        console.log("Deployed Prediction Game for testing...")
        tokenA.transferOwnership(predictionGame.address);
        tokenB.transferOwnership(predictionGame.address);
        console.log("Transferred ownership of tokens to Prediction Game...")
    } else {
        console.log("Skipping Prediction Game Deployment...")
    }
}
