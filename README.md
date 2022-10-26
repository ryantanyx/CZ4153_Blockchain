# CZ4153 Blockchain Project

## Setting up
install dependencies in both folders

```sh
$ cd client
$ npm install
```

```sh
$ cd truffle
$ npm install
```

## Installing Ganache UI

1. Download from [link](https://trufflesuite.com/ganache/)

2. Create development blockchain

3. Verify details in ./truffle/tuffle-config.js (line 46-49) are same as dev blockchain

## Install MetaMask

1. Install from chrome [extension](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en)

2. Add wallet using address from Ganache

3. Add new network:
	- RPC URL --> given in Ganache UI
	- Chain ID --> 1337
	- Currency symbol: ETH

## Testing your contracts

1. Deploying your smart contracts (should see 3 deployments, for now)
```sh
$ cd truffle
$ truffle migrate
```

2. To play with your smart contracts. Sample code below:
	- Create the prediction market instance
	- Create 1 prediction game
	- Show details of prediction game (Address of creator should match address of your wallet)

```sh
$ truffle console
truffle(development)> let ins = await PredictionMarket.deployed()
truffle(development)> const pl = {betTitle: 'asd', expiryDate: 1698323755, choiceA: 'a', choiceB: 'b'}
truffle(development)> ins.createGame(pl)
truffle(development)> ins.predictionMarketRegistry(0)
truffle(development)> let game = await PredictionGame.at('0x0305eE15cadBa72DebF6e555e52149d8B8AF9C92')
truffle(development)> game.provideLiquidity({value: 1000000000000000000})
truffle(development)> game.placeBet('a', {value: 1000000000000000000})
truffle(development)> let pot = await game.totalPot()
truffle(development)> pot.toString()
truffle(development)> let origbal = await game.seeBalance()
truffle(development)> origbal.toString()
truffle(development)> game.testWinner()
truffle(development)> game.withdrawWinnings()
truffle(development)> let newb = await game.seeBalance()
truffle(development)> newb.toString()

$ truffle console --network goerli
ins = await APIConsumer.at('0xf53E329f6AF0EDaa2D2D256467eE08F68993842b')
tx = await ins.requestGames("0x3662303964333762323834663436353562623531306634393465646331313166", "100000000000000000", "resolve", "11", "1664632800")
tx.receipt.logs[0].args[0]
ins.getGamesResolved("0xc41061bd411723ef906d31eae8a034073baeac5a334ea8945bcf0d1f7d4cfeb3", 0)
```


## Ignore everything below for now. Thanks


This box comes with everything you need to start using Truffle to write, compile, test, and deploy smart contracts, and interact with them from a React app.

## Installation

First ensure you are in an empty directory.

Run the `unbox` command using 1 of 2 ways.

```sh
# Install Truffle globally and run `truffle unbox`
$ npm install -g truffle
$ truffle unbox react
```

```sh
# Alternatively, run `truffle unbox` via npx
$ npx truffle unbox react
```

Start the react dev server.

```sh
$ cd client
$ npm start
  Starting the development server...
```

From there, follow the instructions on the hosted React app. It will walk you through using Truffle and Ganache to deploy the `SimpleStorage` contract, making calls to it, and sending transactions to change the contract's state.

## FAQ

- __How do I use this with Ganache (or any other network)?__

  The Truffle project is set to deploy to Ganache by default. If you'd like to change this, it's as easy as modifying the Truffle config file! Check out [our documentation on adding network configurations](https://trufflesuite.com/docs/truffle/reference/configuration/#networks). From there, you can run `truffle migrate` pointed to another network, restart the React dev server, and see the change take place.

- __Where can I find more resources?__

  This Box is a sweet combo of [Truffle](https://trufflesuite.com) and [Create React App](https://create-react-app.dev). Either one would be a great place to start!
