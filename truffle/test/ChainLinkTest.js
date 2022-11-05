const ChainLinkAPIConsumer = artifacts.require("ChainLinkAPIConsumer");
const MockOracle = artifacts.require("MockOracle")
const ERC20Basic = artifacts.require("MockERC20")
const assert = require("assert");
const { fundContractWithLink } = require("../scripts/utils/fundContract")
const {
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const EVM_INSUFFICIENT_LINK = 'VM Exception while processing transaction: revert Insufficient link sent to oracle!'


contract('ChainLinkAPIConsumer contract', (deployer, network, accounts) => {
  let chainLink, mockOracle, linkToken
  beforeEach(async () => {
    chainLink = await ChainLinkAPIConsumer.deployed();
    mockOracle = await MockOracle.deployed()
    linkToken = await ERC20Basic.deployed()

    const network = "development"
    await fundContractWithLink(chainLink.address, network)
    
  })
  it('should initialise with correct Chain Link Oracle address', async() => {
    var value = await chainLink.getOracleAddress();
    
    assert.equal(value, mockOracle.address , "Contract is not initialised correctly");
  });

  it('should send a request to ChainLink', async () => {
    const transaction = chainLink.requestGames("100000000000000000", "resolve", 11, 1665842400)
      
    assert.notEqual(transaction, null, "transaction has not been sent out");
  });
});
