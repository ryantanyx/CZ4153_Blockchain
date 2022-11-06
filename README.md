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

## Compiling contracts for front end
```sh
$ cd truffle
$ truffle compile
```

## Running scripts your contracts

1. Deploying your smart contracts
```sh
$ cd truffle
$ truffle migrate or
$ truffle migrate --network goerli
```

2. To test the smart contracts. Sample code in [Scripts](truffle/scripts/):
	- Create the prediction market instance
	- Create 1 prediction game
	- Show details of prediction game (Address of creator should match address of your wallet)
	- contract addresses for chain link api: 0xdD5e53290C3f2aD293E6C0D51117de25d72A5Ebb

Run the following to exceute in terminal
```sh
$ cd truffle
$ truffle exec scripts/ChainLinkReq.js --network goerli # or
$ truffle exec scripts/PredictionMarketScript.js --network development
```

## Testing scripts
1. You will need to run the tests for the individual scripts one by one
Run the following to exceute in terminal
```sh
$ cd truffle
$ truffle test ./test/PredictionGameTest.js # or
$ truffle test ./test/ChainLinkTest.js # or
```

## Running the front end react application
```sh
$ cd client
$ npm start
```
