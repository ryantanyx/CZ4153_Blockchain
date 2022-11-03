// Poll chainlink smart contract until request is fulfilled
export const waitFulfilled = async (oracle, reqId) => {
    const fulfilled = await oracle.isFulfilled(reqId);
    if (!fulfilled) {
        await new Promise((resolve) => {
            setTimeout(async () => {
                await waitFulfilled(oracle, reqId);
                resolve();
            }, 5000);
        });
        console.log("waiting...")
    }
}

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