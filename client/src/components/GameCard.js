import * as React from 'react';
import { Typography, Card, CardContent, CardActions, Button, Box, Grid, CircularProgress } from '@mui/material';
import { sides } from '../blockchain/predictionGame.js'

const GameCard = ({ onClickOpenGame, game }) => {
    const [gameInfo, setGameInfo] = React.useState(undefined);

    React.useEffect(() => {
        const init = async () => {
            const betTitle = await game.betTitle();
            const choiceA = await game.choices(0);
            const choiceB = await game.choices(1);
            const totalPot = (await game.totalPot()).toString();
            const betA = (await game.bets(sides.A)).toString();
            const betB = (await game.bets(sides.B)).toString();

            const gameInfo = {
                betTitle: betTitle,
                choiceA: choiceA,
                choiceB: choiceB,
                totalPot: totalPot,
                betA: betA,
                betB: betB
            };
            setGameInfo(gameInfo);
        }
        init();
    }, [game]);

    const openGame = React.useCallback(() => {
        onClickOpenGame(true);
    }, [onClickOpenGame]);

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
            <CardActions>
                <Grid container justifyContent="flex-end" >
                    <Button variant="contained" onClick={openGame}>
                        Bet
                    </Button>
                </Grid>
            </CardActions>
        </Card>
    )   
}

export default GameCard;