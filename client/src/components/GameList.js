import * as React from 'react';
import { Container, Box, Grid, Dialog } from '@mui/material';
import GameCard from './GameCard';
import GamePage from './GamePage';

const GameList = ({ wallet, predictionGames }) => {
    const [openGame, setOpenGame] = React.useState(false);

    console.log(predictionGames);

    return (
        <Box sx={{ my: 10 }}>
            <Container fixed>
                <Grid container spacing={2}>
                    {
                        predictionGames != null && predictionGames.map((game) => 
                            <Grid item xs={3}>
                                <GameCard wallet={wallet} onClickOpenGame={setOpenGame} game={game} />
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
            <Dialog open={openGame} fullWidth={true} maxWidth="md">
                <GamePage onClosePage={setOpenGame} />
            </Dialog>
        </Box>
    )
}

export default GameList;