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
    const msg = {from: "0xbE4874f8D8dB230ebBDEA9d720772FF9a40DE493", value: web3.utils.toWei("0.1")}; 
    const transaction = await chainLink.requestGames("100000000000000000", "resolve", 11, 1665842400, msg)
    const requestId = transaction.logs[0].args["requestId"]
    console.log("requestId: ", requestId)
      
    assert.notEqual(requestId, null, "transaction has not been sent out");
  });

  // it('should fail to send a request to ChainLink due to insufficient LINK', async () => {
    // var fn = chainLink.requestGames("10000000000000000", "resolve", "11", "1665842400");

    // assert.throws(() => ChainLink.requestGames("10000000000000000", "resolve", "11", "1665842400"), EVM_INSUFFICIENT_LINK);
    // expect(() => ChainLink.requestGames("10000000000000000", "resolve", "11", "1665842400")).to.throw(EVM_INSUFFICIENT_LINK);
    // assert.notEqual(tx, null, "transaction has not been sent out");
    // await expectRevert(
    //   chainLink.requestGames("100000000000000000", "resolve", "11", "1665842400"),
    //   EVM_INSUFFICIENT_LINK,
    // );
  //   await expectRevert.unspecified(
  //     chainLink.requestGames("100000000000000000", "resolve", "11", "1665842400")
  //   );
  // });


});
