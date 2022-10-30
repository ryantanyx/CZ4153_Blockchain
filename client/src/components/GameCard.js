import * as React from 'react';
import { Typography, Card, CardContent, CardActions, Button, Box, Grid, CircularProgress, Dialog, Snackbar, Alert, Slide } from '@mui/material';
import { sides } from '../blockchain/predictionGame.js';
import LiquidityForm from './LiquidityForm';
import { getEmoji } from '../utils/text.js';
import GamePage from './GamePage';

const GameCard = ({ wallet, game }) => {
    const [gameInfo, setGameInfo] = React.useState(undefined);
    const [openLiquidityForm, setOpenLiquidityForm] = React.useState(false);
    const [openGame, setOpenGame] = React.useState(false);

    // Init upon render
    React.useEffect(() => {
        const init = async () => {
            const betTitle = await game.betTitle();
            const choiceA = await game.choices(0);
            const choiceB = await game.choices(1);
            const totalPot = (await game.totalPot()).toString();
            const betA = (await game.bets(sides.A)).toString();
            const betB = (await game.bets(sides.B)).toString();
            const liquidityInitialised = await game.liquidityInitialised();
            const creator = await game.creator();

            const gameInfo = {
                betTitle: betTitle,
                choiceA: choiceA,
                choiceB: choiceB,
                totalPot: totalPot,
                betA: betA,
                betB: betB,
                liquidityInitialised: liquidityInitialised,
                creator: creator
            };
            setGameInfo(gameInfo);
        }
        init();
    }, [game]);

    // Callback function to update liquidity initialised field
    const initialiseLiquidity = async (totalPot) => {
        const newGameInfo = gameInfo;
        newGameInfo.liquidityInitialised = true;
        newGameInfo.totalPot = totalPot;
        setGameInfo(newGameInfo);
    }

    // Returns the odds bar color background
    const getBarBackground = () => {
        const green = parseInt(gameInfo.betA);
        const red = parseInt(gameInfo.betB);
        if (green + red === 0) {
            return 'linear-gradient(to right, #12892193 50%, #FA121193 50%)'
        } 
        const greenRatio = Math.round((green / (green + red)) * 100);
        const redRatio = 100 - greenRatio;
        return 'linear-gradient(to right, #12892193 ' + greenRatio + '%, #FA121193 ' + redRatio + '%)';
    }

    // Snackbar
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    // Do not render card until initialised
    if (typeof gameInfo === 'undefined') {
        return (
            <Card>
            <CardContent>
                <Typography fontWeight={700} sx={{ fontSize: 14 }} gutterBottom>
                    Loading...
                </Typography>
                <Box 
                    mt={2}
                    style={{ background: 'grey' }}
                    sx={{ borderRadius: 1 }}>
                    <Grid container justifyContent="space-between">
                        <Typography fontWeight={600} ml={1} >Loading...</Typography>
                    </Grid>
                </Box>
                <Typography mt={1}>Total Pot: Loading...</Typography>
            </CardContent>
            <Grid container justifyContent="flex-end" pr={3} pb={1} >
                <CircularProgress pr={3}/>
            </Grid>
        </Card>
        )
    }

    return(
        <Card>
            <CardContent>
                <Typography fontWeight={700} sx={{ fontSize: 14 }} gutterBottom>
                    {gameInfo.betTitle}
                </Typography>
                <Box 
                    mt={2}
                    style={{ background: getBarBackground() }}
                    sx={{ borderRadius: 1 }}>
                    <Grid container justifyContent="space-between">
                        <Typography fontWeight={600} ml={1} >{gameInfo.choiceA}</Typography>
                        <Typography fontWeight={600} mr={1}>{gameInfo.choiceB}</Typography>
                    </Grid>
                </Box>
                <Typography mt={1}>Total Pot: {gameInfo.totalPot} ETH</Typography>
            </CardContent>
            {gameInfo.liquidityInitialised ? 
                <CardActions>
                    <Grid container justifyContent="flex-end" >
                        <Button variant="contained" onClick={() => setOpenGame(true)}>
                            Bet
                        </Button>
                    </Grid>
                </CardActions>
            :
            gameInfo.creator === wallet ? 
                <CardActions>
                    <Grid container justifyContent="flex-end" >
                        <Button variant="contained" onClick={() => setOpenLiquidityForm(true)} >
                            Provide Liquidity
                        </Button>
                    </Grid>
                </CardActions>
            :
                <CardActions>
                    <Grid container justifyContent="space-between" alignItems="end" >
                        <Typography color="grey">Cannot bet when liquidity pool is empty!</Typography>
                        <Button disabled variant="contained" onClick={() => setOpenGame(true)}>
                            Bet
                        </Button>
                    </Grid>
                </CardActions>
            }
            <Dialog open={openLiquidityForm} fullWidth={true} maxWidth="md">
                <LiquidityForm wallet={wallet} onCloseForm={setOpenLiquidityForm} game={game} initialiseLiquidity={initialiseLiquidity} triggerSnackbar={setOpenSnackbar} />
            </Dialog>
            <Dialog open={openGame} fullWidth={true} maxWidth="md">
                <GamePage onClosePage={setOpenGame} />
            </Dialog>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} TransitionComponent={Slide} >
                <Alert onClose={handleCloseSnackbar} severity="success" variant="filled" sx={{ width: '100%' }}>
                    Liquidity added! Players can now place bets on your game! {getEmoji(0x1F525)}{getEmoji(0x1F525)}{getEmoji(0x1F525)}
                </Alert>
            </Snackbar>
        </Card>
    )   
}

export default GameCard;