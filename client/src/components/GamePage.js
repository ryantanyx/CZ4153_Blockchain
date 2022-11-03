import * as React from 'react';
import { Stack, TextField, ButtonGroup, Button, Box, DialogTitle, IconButton, Grid, Typography, Container, TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getBarBackground, getDateTimeString } from '../utils/helper.js';
import { getToken, getTokenBalance } from '../blockchain/token.js'
import { isInt } from '../utils/math.js';
import { getGameInfo } from '../blockchain/predictionGame.js';
import { getEmoji } from '../utils/text.js';
import { waitFulfilled } from '../blockchain/oracle.js';

const GamePage = ({ onClosePage, game, gameInfo, wallet, updateGameInfo, triggerSnackbar, oracle, updateGame }) => {
    const [choice, setChoice] = React.useState(true);
    const [bets, setBets] = React.useState(undefined);
    const [amount, setAmount] = React.useState("0");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [currentTime, setCurrentTime] = React.useState(Math.round(Date.now()/1000));

    // Init upon render
    React.useEffect(() => {
        const init = async () => {
            // Get player's balance of the tokens
            const tokenAddressA = await game.tokenA();
            const tokenA = await getToken(tokenAddressA);
            const tokenBalanceA = await getTokenBalance(tokenA, wallet);
            const tokenAddressB = await game.tokenB();
            const tokenB = await getToken(tokenAddressB);
            const tokenBalanceB = await getTokenBalance(tokenB, wallet);
            const bets = {
                A: tokenBalanceA,
                B: tokenBalanceB
            }
            setBets(bets);
        }
        init();
    }, [game, wallet, gameInfo]);

    // Get button color based on choice selected
    const getButtonColor = (choiceA) => {
        if (choiceA) {
            // Choice A selected
            if (choice) {
                return "success"
            } else {
                return "primary"
            }
        } else {
            // Choice B selected
            if (choice) {
                return "primary"
            } else {
                return "error"
            }
        }
    }

    // Select choice by clicking button
    const selectChoice = (choiceA) => {
        setChoice(choiceA);
    }

    // Close the game page
    const closeGamePage = React.useCallback(() => {
        onClosePage(false);
    }, [onClosePage]);

    // Call smart contract to place bet
    const placeBet = async () => {
        setErrorMessage("");

        if (amount === "" || amount === null || amount === "0") {
            // Check if blank or zero
            setErrorMessage("Please enter a non-zero value!");
        } else if (!isInt(amount)) {
            setErrorMessage("Number of Wei cannot be a decimal!")
        } else {
            try {
                // Call smart contract
                const playerChoice = choice ? gameInfo.choiceA : gameInfo.choiceB;
                const tx = await game.placeBet(playerChoice, {value: amount});
                await tx.wait();
                // Update game info in gamecard
                const newGameInfo = await getGameInfo(game);
                updateGameInfo(newGameInfo);
                // Open success snackbar
                triggerSnackbar("success", `Successfully placed bet! Hope your bets will take you to the moon! ${getEmoji(0x1F680)}${getEmoji(0x1F680)}${getEmoji(0x1F680)}`);
            } catch (error) {
                console.log("Error: " + error.message);
            }
        }
    }

    // Call smart contract to resolve the winner of the game
    const resolveWinner = async () => {
        try {
            // Call chain link smart contract to get winner 
            const tx = await oracle.requestGames("resolve", gameInfo.sportId, gameInfo.expiryTime);
            console.log(tx);
            const txReceipt = await tx.wait();
            console.log(txReceipt);
            const reqId = txReceipt.logs[0].topics[1];
            console.log(reqId);
            // Check if request has been fulfilled by chainlink
            await waitFulfilled(oracle, reqId);
            const result = await oracle.getGamesResolved(reqId);
            console.log(result);
            let game = null;
            for (let i = 0; i < result.length; i++) {
                if (gameInfo.gameId === result[i].gameId) {
                    game = result[i];
                    break;
                }
            }
            const winner = (game.homeScore > game.awayScore) ? gameInfo.choiceA : ((game.homeScore < game.awayScore) ? gameInfo.choiceB : "_draw_");
            // Call prediction game smart contract to update winner
            const updateTx = await game.updateWinner(winner);
            await updateTx.wait();
            // Update winner on UI
            updateGame();
            // Trigger snackbar
            triggerSnackbar("success", `Successfully resolved winner! Congrats on your win/loss! ${getEmoji(0x1F525)}${getEmoji(0x1F525)}${getEmoji(0x1F525)}`);
        } catch (error) {
            console.log("Error: " + error.message);
        }
    }

    // Call smart contract to withdraw winnings
    const withdrawWinnings = async () => {
        // Check if winner already resolved
        if (gameInfo.winner === "") {
            // Show error snack bar
            triggerSnackbar("error", `Winner hasn't been resolved yet! ${getEmoji(0x1F440)}${getEmoji(0x1F440)}${getEmoji(0x1F440)}`);
        } else {
            try {
                const tx = await game.withdrawWinnings();
                await tx.wait();
                triggerSnackbar("success", `Successfully withdrawn winnings! ${getEmoji(0x1F31A)}${getEmoji(0x1F31A)}${getEmoji(0x1F31A)}`);
            } catch (error) {
                console.log("Error: " + error.message);
                // Show error snack bar
                triggerSnackbar("error", `You have no winnings to withdraw! ${getEmoji(0x1F62D)}${getEmoji(0x1F62D)}${getEmoji(0x1F62D)}`);
            }
        }
    }

    // Call smart contract to withdraw liquidity (doesn't need winner to be resolved yet, as long as game is closed)
    const withdrawLiquidity = async () => {
        try {
            const tx = await game.withdrawLiquidity();
            await tx.wait();
            triggerSnackbar("success", `Successfully withdrawn liquidity! ${getEmoji(0x1F31A)}${getEmoji(0x1F31A)}${getEmoji(0x1F31A)}`);
        } catch (error) {
            console.log("Error: " + error.message);
            // Show error snack bar
            triggerSnackbar("error", `You have no liquidity to withdraw! ${getEmoji(0x1F62D)}${getEmoji(0x1F62D)}${getEmoji(0x1F62D)}`);
        }
    }

    return (
        <Box>
            <Grid container justifyContent="space-between" >
                <DialogTitle variant="h5" fontWeight="700" >Make a Bet</DialogTitle>
                <IconButton onClick={closeGamePage} >
                    <CloseIcon />
                </IconButton>
            </Grid>
            <Container>
                <Typography fontWeight="700" variant="h4">{(currentTime >= gameInfo.expiryTime) ? "[CLOSED] " : ""}{gameInfo.betTitle}</Typography>
                <Box
                    height={30}
                    mt={2}
                    style={{ background: getBarBackground(gameInfo) }}
                    sx={{ borderRadius: 1 }}>
                    <Grid container justifyContent="space-between" alignItems="center" height="100%">
                        <Typography variant="h5" fontWeight={600} ml={1} >{gameInfo.choiceA}{(gameInfo.winner === gameInfo.choiceA ? getEmoji(0x1F451) : "")}</Typography>
                        { gameInfo.winner === "_draw_" ? <Typography variant="h5" fontWeight={600}>{getEmoji(0x1F631)}DRAW{getEmoji(0x1F631)}</Typography> : "" }
                        <Typography variant="h5" fontWeight={600} mr={1}>{(gameInfo.winner === gameInfo.choiceB ? getEmoji(0x1F451) : "")}{gameInfo.choiceB}</Typography>
                    </Grid>
                    <Grid container justifyContent="space-between">
                        <Typography>Expires: {getDateTimeString(gameInfo.expiryTime)}</Typography>
                        <Typography>Total Pot: {gameInfo.totalPot} ETH</Typography>
                    </Grid>
                </Box>
                <Grid container my={2} spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="h5" fontWeight={600} >Your Holdings</Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Shares</strong></TableCell>
                                        <TableCell><strong>Token Quantity</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{gameInfo.choiceA}</TableCell>
                                        <TableCell>{typeof bets === 'undefined' ? <CircularProgress size='10px'/> : bets.A}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{gameInfo.choiceB}</TableCell>
                                        <TableCell>{typeof bets === 'undefined' ? <CircularProgress size='10px'/> : bets.B}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Stack mt={2} direction="row" space={4} style={{ display: "flex" }} justifyContent="space-between" >
                            <Box sx={{ width: "49%" }}>
                                {
                                    (currentTime < gameInfo.expiryTime) ?
                                        <Button disabled variant="contained" sx={{ width: "100%" }}>Resolve Winner</Button>
                                    :
                                        (gameInfo.winner === "") ?
                                            <Button variant="contained" onClick={resolveWinner} sx={{ width: "100%" }}>Resolve Winner</Button>
                                        :
                                            <Button variant="contained" onClick={withdrawWinnings} sx={{ width: "100%" }}>Withdraw Winnings</Button>
                                }
                                
                            </Box>
                            <Box sx={{ width: "49%" }}>
                                <Button disabled={currentTime<gameInfo.expiryTime || gameInfo.creator !== wallet} variant="contained" onClick={withdrawLiquidity} sx={{ width: "100%" }}>Withdraw Liquidity</Button>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" fontWeight={600}>Place your bets!</Typography>
                        <Stack spacing={1} justifyContent="center" alignItems="center" sx={{ border: '1px solid #e6dddc', py: 2, borderRadius: 1 }}>
                            <ButtonGroup
                                size="large"
                                variant="contained"
                                orientation="vertical"
                                sx={{ width: '75%' }}>
                                <Button color={getButtonColor(true)} onClick={() => selectChoice(true)}>{gameInfo.choiceA}</Button>
                                <Button color={getButtonColor(false)} onClick={() => selectChoice(false)}>{gameInfo.choiceB}</Button>
                            </ButtonGroup>
                            <Typography variant="h6" align="left" sx={{ width: '75%' }}>ETH Amount</Typography>
                            <TextField 
                                type="number"
                                size="small"
                                sx={{ width: '75%' }}
                                error={errorMessage !== ""}
                                id="outlined-error-helper-text"
                                helperText={errorMessage}
                                onChange={(e) => setAmount(e.target.value)}    
                            />
                            <Button disabled={currentTime>=gameInfo.expiryTime} variant="contained" sx={{ width: '75%' }} onClick={placeBet}>Buy</Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default GamePage;