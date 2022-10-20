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
$ truffle migrate or
$ truffle migrate --network goerli
```

2. To play with your smart contracts. Sample code in [Scripts](truffle/scripts/):
	- Create the prediction market instance
	- Create 1 prediction game
	- Show details of prediction game (Address of creator should match address of your wallet)
	- contract addresses: '0xf53E329f6AF0EDaa2D2D256467eE08F68993842b', '0x0820a78c3cABA8f8E7254A0Bc1041607720eE4A3') #messed up code, '0xe604949deEbAa391257857e45Cae23cE6472518e', '0x0438435bA324ba51dcfEeCc0d3a420D592fa17dD', '0x043571558BDf77eB3290DCe02Bc4bDFBAd0D4ea6'

Run the following to exceute in terminal
```sh
$ cd truffle
$ truffle exec scripts/request.js --network goerli # or
$ truffle exec scripts/PredictionMarket.js --network development
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
