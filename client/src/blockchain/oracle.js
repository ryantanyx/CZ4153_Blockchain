// Calls ChainLink smart contract to retrieve winner of a game
export const resolveWinner = async (oracle, sportId, expiryTime, gameId) => {
    try {
        const tx = await oracle.requestGames("100000000000000000", "resolve", sportId, expiryTime);
        const txReceipt = await tx.wait();
        const reqId = txReceipt.logs[0].topics[0];
        await new Promise(r => setTimeout(r, 100000));
        const result = await oracle.getGamesCreated(reqId);
        // TODO: Iterate though and find result
        return "";
    } catch (error) {
        console.log("Error:" + error.message);
        return "";
    }
}