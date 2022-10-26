const ChainLinkAPIConsumer = artifacts.require("ChainLinkAPIConsumer");
const MockERC20 = artifacts.require("MockERC20")
const MockOracle = artifacts.require("MockOracle")
const web3 = require("web3")

const { networkConfig, developmentChains } = require("../helper-truffle-config")
const { fundContractWithLink } = require("../scripts/utils/fundContract")

module.exports = async function (deployer, network) {
  let oracle, linkTokenAddress

  if (developmentChains.includes(network)) {
      const linkToken = await MockERC20.deployed()
      const mockOracle = await MockOracle.deployed()
      linkTokenAddress = linkToken.address
      oracle = mockOracle.address
  } else {
      linkTokenAddress = networkConfig[network]["linkToken"]
      oracle = networkConfig[network]["oracle"]
  }
  const jobId = web3.utils.toHex(networkConfig[network]["jobId"])
  const fee = networkConfig[network]["fee"]

  await deployer.deploy(ChainLinkAPIConsumer, oracle, jobId, fee, linkTokenAddress)
  console.log("ChainLink API Consumer Deployed!")

  console.log("Let's fund the contract with Link...")
  const ChainLinkInst = await ChainLinkAPIConsumer.deployed()

  await fundContractWithLink(ChainLinkInst.address, network)
}


// module.exports = async function (deployer) {
//   await deployer.deploy(ChainLinkAPIConsumer);
// };
