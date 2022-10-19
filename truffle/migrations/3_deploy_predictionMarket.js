const ERC20Basic = artifacts.require("ERC20Basic");
const PredictionMarket = artifacts.require("PredictionMarket");


module.exports = async function (deployer) {
  // const ERC20BasicInst = await ERC20Basic.deployed();
  await deployer.deploy(PredictionMarket);
};
