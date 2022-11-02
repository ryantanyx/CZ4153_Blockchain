const PredictionMarket = artifacts.require("PredictionMarket");
const ChainLinkAPIConsumer = artifacts.require("ChainLinkAPIConsumer");
const GameContractFactory = artifacts.require("GameContractFactory");

module.exports = async function (deployer) {
  await deployer.deploy(GameContractFactory);
  const ChainLinkInst = await ChainLinkAPIConsumer.deployed()
  const gameContractFactoryInst = await GameContractFactory.deployed()

  console.log("Chainlink deployed at: " + ChainLinkInst.address)
  console.log("Game Factory deployed at: " + gameContractFactoryInst.address)
  await deployer.deploy(PredictionMarket, ChainLinkInst.address, gameContractFactoryInst.address);
};
