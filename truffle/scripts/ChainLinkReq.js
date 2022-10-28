const ChainLinkAPIConsumer = artifacts.require("ChainLinkAPIConsumer");

module.exports = async callback => {
    const ins = await ChainLinkAPIConsumer.at('0x3a31e430Ce7317c1E6FD642B243A455Bb9EdcE60')
    console.log("Getting contract address: ", ins.address);
    tx = await ins.requestGames("100000000000000000", "resolve", "11", "1665842400")
    // tx = await ins.requestSpecificGames("100000000000000000", "resolve", "11", "1665842400", ['0x6466303138303533646630616636356331306136396633616565643661376531', '0x3131313363363536623866666539663133323232356530366362323037373761'])
    
    console.log("Getting transection details address: ", tx);
    reqId = tx.receipt.logs[0].args[0]

    
    await new Promise(r => setTimeout(r, 50000));
    console.log("Waiting for request to be fulfilled...")
    result = await ins.getGamesResolved(reqId)
    console.log("Getting request result address: ", result);


    callback(console.log("Function call completed..."));

};

// module.exports = async callback => {
//     const ins = await ChainLinkAPIConsumer.at('0x0438435bA324ba51dcfEeCc0d3a420D592fa17dD')
//     console.log("Getting contract address: ", ins.address);
//     tx = await ins.requestGames("100000000000000000", "create", "11", "1666447200")
    
//     console.log("Getting transection details address: ", tx);
//     reqId = tx.receipt.logs[0].args[0]

    
//     await new Promise(r => setTimeout(r, 60000));
//     console.log("Waiting for request to be fulfilled...")
//     result = await ins.getGamesCreated(reqId)
//     console.log("Getting request result address: ", result);


//     callback(console.log("Function call completed..."));

// };