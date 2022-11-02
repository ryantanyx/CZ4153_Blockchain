const PredictionGame = artifacts.require("PredictionGame");
const ERC20Basic = artifacts.require("ERC20Basic");
const { developmentChains } = require("../helper-truffle-config")

module.exports = async function (deployer, network, accounts) {
    if (developmentChains.includes(network)) {
        creator = accounts[0];
        expiryTime = 1668265200;
        await deployer.deploy(ERC20Basic, "Token A", "TKA");
        const tokenA = await ERC20Basic.deployed()
        await deployer.deploy(ERC20Basic, "Token B", "TKB");
        const tokenB = await ERC20Basic.deployed()
        betTile = "Test title"
        choiceA = "Side A"
        choiceB = "Side B"
        console.log("Token A: " + tokenA.address + "\nToken B: " + tokenB.address)
        predictionGame = await deployer.deploy(PredictionGame, creator, expiryTime, tokenA.address, tokenB.address, betTile, choiceA, choiceB)
        console.log("Deployed Prediction Game for testing...")
        tokenA.transferOwnership(predictionGame.address);
        tokenB.transferOwnership(predictionGame.address);
        console.log("Transferred ownership of tokens to Prediction Game...")
    } else {
        console.log("Skipping Prediction Game Deployment...")
    }
}
