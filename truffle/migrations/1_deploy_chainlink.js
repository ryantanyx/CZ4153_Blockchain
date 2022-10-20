const ChainLinkAPIConsumer = artifacts.require("ChainLinkAPIConsumer");

module.exports = async function (deployer) {
  await deployer.deploy(ChainLinkAPIConsumer);
};
