import * as React from 'react';
import { Typography, Card, CardContent, CardActions, Button, Box, Grid, CircularProgress, Dialog } from '@mui/material';
import { getGameInfo } from '../blockchain/predictionGame.js';
import LiquidityForm from './LiquidityForm';
import GamePage from './GamePage';
import { getBarBackground } from '../utils/helper.js';

const GameCard = ({ wallet, game, updateSnackbar }) => {
    const [gameInfo, setGameInfo] = React.useState(undefined);
    const [openLiquidityForm, setOpenLiquidityForm] = React.useState(false);
    const [openGame, setOpenGame] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(Math.round(Date.now()/1000));

    // Init upon render
    React.useEffect(() => {
        const init = async () => {
            const gameInfo = await getGameInfo(game);
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
                    {(currentTime >= gameInfo.expiryTime) ? "[CLOSED] " : ""}{gameInfo.betTitle}
                </Typography>
                <Box 
                    mt={2}
                    style={{ background: getBarBackground(gameInfo) }}
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
                        <Button disabled={currentTime>=gameInfo.expiryTime} variant="contained" onClick={() => setOpenLiquidityForm(true)} >
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
                <LiquidityForm wallet={wallet} onCloseForm={setOpenLiquidityForm} game={game} initialiseLiquidity={initialiseLiquidity} triggerSnackbar={updateSnackbar} />
            </Dialog>
            <Dialog open={openGame} fullWidth={true} maxWidth="md">
                <GamePage onClosePage={setOpenGame} game={game} gameInfo={gameInfo} wallet={wallet} updateGameInfo={setGameInfo} triggerSnackbar={updateSnackbar} />
            </Dialog>
        </Card>
    )   
}

export default GameCard;