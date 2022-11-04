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