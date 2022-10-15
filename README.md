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
truffle(development)> const myE = {A:0, B:1}; const pl = {sideADetails:"test A", sideBDetails: "testB", expiryTime: 1665899999, chosenSide : myE.A}; const msg = {from: "0xbE4874f8D8dB230ebBDEA9d720772FF9a40DE493", value: web3.utils.toWei('0.12')};
truffle(development)> ins.createGame(pl, msg)
truffle(development)> ins.getPredictionGameById(0)		// use this address for next line, shouldnt be all zeros
truffle(development)> game = await PredictionGame.at('0x6515B25dC446746B33e42B7dbB7739E13dDAF6cc')	// See above in-line comment 
truffle(development)> game.getBettingGameInfo()
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
