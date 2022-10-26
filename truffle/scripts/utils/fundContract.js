const LinkToken = artifacts.require("MockERC20")
const { networkConfig, developmentChains } = require("../../helper-truffle-config")

const payment = process.env.TRUFFLE_CL_BOX_PAYMENT || "1000000000000000000" // 1.0 LINK

async function fundContractWithLink(contractAddress, network) {
    let linkToken
    if (developmentChains.includes(network)) {
        linkToken = await LinkToken.deployed()
    } else {
        linkToken = await LinkToken.at(networkConfig[network]["linkToken"])
    }
    try {
        const tx = await linkToken.transfer(contractAddress, payment)
        console.log("Contract funded with Link")
    } catch (e) {
        console.log(e)
        console.log("Looks like there was an issue! Make sure you have enough LINK in your wallet!")
    }
}

module.exports = {
    fundContractWithLink,
}