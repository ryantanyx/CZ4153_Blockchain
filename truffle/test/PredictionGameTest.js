const PredictionGame = artifacts.require("PredictionGame");
const ERC20Basic = artifacts.require("ERC20Basic");

const assert = require("assert");
const truffleAssert = require('truffle-assertions');
const { expectRevert } = require('@openzeppelin/test-helpers');

var Web3 = require('web3');
var web3 = new Web3('http://127.0.0.1:7545');

contract('Creating Prediction Game contract', (deployer, network, accounts) => {
    let predictionGame, owner, tokenA, tokenB, addressA, addressB
    const mockValues = {
        expiryTime : 1668265200, 
        betTile : "Test title",
        choiceA : "Side A", 
        choiceB : "Side B"};
    
    beforeEach(async () => {
        predictionGame = await PredictionGame.deployed();  
        let accounts = await web3.eth.getAccounts()
        owner = accounts[0];
        player = accounts[1];

        addressA = await web3.eth.getStorageAt(predictionGame.address, 7)
        addressB = await web3.eth.getStorageAt(predictionGame.address, 8)
        tokenA = await ERC20Basic.at(addressA)
        tokenB = await ERC20Basic.at(addressB);
    })

    it('it should initialise with correct Game creator', async () => {
        var actualValue = await predictionGame.creator();
        assert.equal(actualValue, owner , "Game creator is incorrect");
    });

    it('it should be created with the correct choice A', async () =>{
        var choiceA = await predictionGame.choices(0)
        assert.equal(choiceA, mockValues.choiceA, "Choice A is incorrect")
      })
  
    it('it should be created with the correct choice B', async () =>{
    var choiceB = await predictionGame.choices(1)
    assert.equal(choiceB, mockValues.choiceB, "Choice B is incorrect")
    })

    it('it should be created with the correct expiry Time', async () =>{
        var expiryTime = await predictionGame.expiryTime()
        assert.equal(expiryTime, mockValues.expiryTime, "Expiry date is incorrect")
      })

    describe("Testing provideLiquidity function", () => {
        it('it should only allow the creator to provide liquidity', async () => {
            let msg  = {from: player, value: "10000000000000000"}
            await expectRevert(
                await predictionGame.provideLiquidity(msg),
                "You are not the creator of this game!",
            );            
        })

        it("it should mint the tokens to the prediction game", async () => {
            actualValue = "10000000000000000"
            let msg  = {from: owner, value: actualValue}
            await predictionGame.provideLiquidity(msg)
            let tokenABal = await tokenA.balanceOf(predictionGame.address)
            let tokenBBal = await tokenB.balanceOf(predictionGame.address)
            assert.equal(tokenABal, actualValue, "Token A has not been minted to the game")
            assert.equal(tokenBBal, actualValue, "Token B has not been minted to the game")
        })
    })
})