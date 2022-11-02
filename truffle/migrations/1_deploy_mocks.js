const MockERC20 = artifacts.require("MockERC20");
const MockOracle = artifacts.require("MockOracle");
const { developmentChains } = require("../helper-truffle-config")

module.exports = async function (deployer, network) {
  if (developmentChains.includes(network)) {
      console.log("Deploying Mocks...")
      await deployer.deploy(MockERC20)
      const linkToken = await MockERC20.deployed()
      const mockOracle = await deployer.deploy(MockOracle, linkToken.address)
      console.log("Mocks Deployed! Oracle address: ", mockOracle.address, linkToken.address)
  } else {
      console.log("Skipping Mocks Deployment...")
  }
}
