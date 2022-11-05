const ChainLinkAPIConsumer = artifacts.require("ChainLinkAPIConsumer");

module.exports = async callback => {
    0x3a31e430Ce7317c1E6FD642B243A455Bb9EdcE60
    const ins = await ChainLinkAPIConsumer.at('0xdD5e53290C3f2aD293E6C0D51117de25d72A5Ebb')
    console.log("Getting contract address: ", ins.address);
    const msg = {from: "0xbE4874f8D8dB230ebBDEA9d720772FF9a40DE493"};
    // tx = await ins.requestGames("100000000000000000", "create", "11", "1667617200", msg)
    // tx = await ins.requestSpecificGames("1000000000000000000", "resolve", "11", "1665842400", ['0x6466303138303533646630616636356331306136396633616565643661376531'])
    // tx = await ins.requestGames("100000000000000000", "resolve", "11", "1665842400")
    tx = await ins.requestGames("create", "11", "1668265200")

    console.log("Getting transection details address: ", tx);
    reqId = tx.receipt.logs[0].args[0]

    console.log("Waiting for request to be fulfilled, id: " + reqId)
    await new Promise(r => setTimeout(r, 120000));   // wait 2mins
    
    result = await ins.getGamesResolved(reqId)
    console.log("Getting request result address: ", result);


    callback(console.log("Function call completed..."));

};

module.exports = async callback => {
    const ins = await ChainLinkAPIConsumer.at('0xFA3EaB09308b3397AA12eaA92bcE768ADb505Ed9')
    console.log("Getting contract address: ", ins.address);

    tx = await ins.requestGames("100000000000000000", "create", "11", "1666447200")
    console.log("Getting transection details address: ", tx);
    reqId = tx.receipt.logs[0].args[0]

    console.log("Waiting for request to be fulfilled for reqId: " + reqId)
    await new Promise(r => setTimeout(r, 60000));
    console.log("Waiting for request to be fulfilled...")
    result = await ins.getGamesCreated(reqId)
    console.log("Getting request result address: ", result);


    callback(console.log("Function call completed..."));

};