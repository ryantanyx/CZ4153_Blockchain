// Calls ChainLink smart contract to retrieve winner of a game
// export const resolveWinner = async (oracle, sportId, expiryTime, gameId) => {
//     try {
//         const tx = await oracle.requestGames("100000000000000000", "resolve", sportId, expiryTime);
//         const txReceipt = await tx.wait();
//         const reqId = txReceipt.logs[0].topics[0];
//         await new Promise(r => setTimeout(r, 100000));
//         const result = await oracle.getGamesCreated(reqId);
//         // TODO: Iterate though and find result
//         return "";
//     } catch (error) {
//         console.log("Error:" + error.message);
//         return "";
//     }
// }

export const resolveWinner = async (oracle, sportId, expiryTime, gameId) => {
    try {
        let reqId;
        oracle.requestGames("resolve", sportId, expiryTime, [gameId]).then( result => {
            reqId = result.logs[0].topics[0];
            let isReqFulfilled = false;
            while (!isReqFulfilled) {
                isReqFulfilled = oracle.isFulfilled[reqId]
            }

            oracle.getGamesResolved(reqId).then(result => {
                console.log(result);
            })
        })
        // TODO: Iterate though and find result
        return "";
    } catch (error) {
        console.log("Error:" + error.message);
        return "";
    }
}
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
    }
}

export const getGamesInfo = async (oracle, sportId, expiryTime) => {
    try {
        let reqId;
        await oracle.requestGames("create", sportId, expiryTime).then( result => {
            console.log(result)
            reqId = result.logs[0].topics[0];
            let isReqFulfilled = false;
            while (!isReqFulfilled) {
                isReqFulfilled = oracle.isFulfilled[reqId]
            }

            oracle.getGamesResolved(reqId).then(result => {
                console.log(result);
            })
        })
        return "";
    } catch (error) {
        console.log("Error:" + error.message);
        return "";
    }
}