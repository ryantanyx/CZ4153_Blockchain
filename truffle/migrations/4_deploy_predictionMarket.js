const PredictionMarket = artifacts.require("PredictionMarket");

module.exports = async function (deployer) {
  await deployer.deploy(PredictionMarket);
};
