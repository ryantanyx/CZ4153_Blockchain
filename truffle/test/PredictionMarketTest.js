const PredictionMarket = artifacts.require("PredictionMarket");
const PredictionGame = artifacts.require("PredictionGame");
const ChainLinkAPIConsumer = artifacts.require("ChainLinkAPIConsumer");
const GameContractFactory = artifacts.require("GameContractFactory");

const assert = require("assert");
const truffleAssert = require('truffle-assertions');
var Web3 = require('web3');
var web3 = new Web3('http://127.0.0.1:7545');

contract('Creating Prediction Market contract', (deployer, network, accounts) => {
  let predictionMarket, chainLink, gameFactory, owner
  const payload = {betTitle : "Test title", expiryDate : 1666842400, choiceA: "test A", choiceB : "test B"};
  
  beforeEach(async () => {
    predictionMarket = await PredictionMarket.deployed();
    chainLink = await ChainLinkAPIConsumer.deployed()
    gameFactory = await GameContractFactory.deployed();

    let accounts = await web3.eth.getAccounts()
    owner = accounts[0];
  })
  it('it should initialise with correct chain link address', async () => {
    var value = await predictionMarket.getChainLinkAddress();
    assert.equal(value, chainLink.address , "Chain link address is incorrect");
  });

  it('it should initialise with correct game factory address', async () => {
    var factory = await web3.eth.getStorageAt(predictionMarket.address, 4);
    assert.equal(factory, gameFactory.address.toLowerCase() , "Game factory address incorrect");
  });

  it('it should have zero games in the market', async () => {
    var value = await web3.eth.getStorageAt(predictionMarket.address, 1);     
    assert.equal(value, 0 , "Contract is not initialised correctly");
  });

  describe("Creating new Prediction Game", async () => {
    let predictionGameAddr, events, predictionGame
    
    beforeEach(async () => {
      events = await predictionMarket.createGame(payload)
      predictionGameAddr = await predictionMarket.predictionMarketRegistry(0);
      predictionGame = await PredictionGame.at(predictionGameAddr);
    })

    it('it should have emitted "PredictionGameCreated" event', async () => {
      eventParams = {
        creator : owner
      }
      
      truffleAssert.eventEmitted(events, 'PredictionGameCreated', eventParams);
    });

    it("it should have increased the value in prediction game registry", async () => {
      var value = await web3.eth.getStorageAt(predictionMarket.address, );    
      assert.notEqual(value, 0 , "Value in prediction game registry is not increased");
    })

    it("its address should be stored in prediction game registry", async () =>{

      assert.equal(predictionGame.address, predictionGameAddr , "Address in prediction game registry is incorrect");
    })
  
    it('it should be created with the correct variables', async () =>{
      var expiryTime = await predictionGame.expiryTime() 
      var creator = await predictionGame.creator()
      var betTitle = await predictionGame.betTitle()
      var choiceA = await predictionGame.choices(0)
      var choiceB = await predictionGame.choices(1)

      assert.equal(expiryTime, payload.expiryDate, "Expiry date is incorrect")
      assert.equal(creator, owner, "Owner of the created prediction game is incorrect")
      assert.equal(betTitle, payload.betTitle, "Expiry date is incorrect")
      assert.equal(choiceA, payload.choiceA, "Choice A is incorrect")
      assert.equal(choiceB, payload.choiceB, "Choice B is incorrect")
    })

    it('it should have emitted transfer ownership event for 2 tokens', async() =>{
      zeroAddress = "0x0000000000000000000000000000000000000000"
      eventParams = {
        previousOwner : zeroAddress,
        newOwner : predictionMarket.address
      }

      truffleAssert.eventEmitted(events, 'OwnershipTransferred', eventParams);
    })
  })
});
