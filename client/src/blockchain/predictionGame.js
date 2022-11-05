import { getPredictionGame } from './ethereum.js';

export const sides = {
    A: 0,
    B: 1
};

// Fetch all games from prediction market
export const fetchGames = async (predictionMarket) => {
    // Get all the prediction game addresses
    const gameCount = parseInt((await predictionMarket.predictionGameCount()).toString());
    const predictionGameAddresses = await Promise.all(
      [...Array(gameCount).keys()].map(x => predictionMarket.predictionMarketRegistry(x))
    );

    const predictionGames = await Promise.all(
      predictionGameAddresses.map(x => getPredictionGame(x))
    );
    return predictionGames;
}

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
    const expiryTime = (await game.expiryTime()).toString();
    const winner = await game.winner();
    const sportId = await game.sportId();
    const gameId = await game.gameId();

    const gameInfo = {
        betTitle,
        choiceA,
        choiceB,
        totalPot,
        betA,
        betB,
        liquidityInitialised,
        creator,
        internalTokenA,
        internalTokenB,
        expiryTime,
        winner,
        sportId,
        gameId
    };
    console.log(gameInfo)
    return gameInfo;
}