

module.exports = async callback => {
    // const ins = await APIConsumer.deployed()
    const ins = await APIConsumer.at('0xf53E329f6AF0EDaa2D2D256467eE08F68993842b')
    console.log("Getting contract address: ", ins.address);
    const tx = await ins.requestGames(
        "0x3662303964333762323834663436353562623531306634393465646331313166", 
        "100000000000000000", 
        "resolve", 
        "11", 
        "1665925200");
    
    callback(tx.tx);

};