export const sides = {
    A: 0,
    B: 1
};

// Get game details
export const getGameInfo = async (game) => {
    const betTitle = await game.betTitle();
    const choiceA = await game.choices(0);
    const choiceB = await game.choices(1);
    const totalPot = (await game.totalPot()).toString();
    const betA = (await game.bets(sides.A)).toString();
    const betB = (await game.bets(sides.B)).toString();
    const liquidityInitialised = await game.liquidityInitialised();
    const creator = await game.creator();
    const internalTokenA = await game.seeInternalTokens(sides.A);
    const internalTokenB = await game.seeInternalTokens(sides.B);

    const gameInfo = {
        betTitle: betTitle,
        choiceA: choiceA,
        choiceB: choiceB,
        totalPot: totalPot,
        betA: betA,
        betB: betB,
        liquidityInitialised: liquidityInitialised,
        creator: creator,
        internalTokenA: internalTokenA,
        internalTokenB: internalTokenB
    };
    return gameInfo;
}