import * as React from 'react';
import { Container, Box, Grid } from '@mui/material';
import GameCard from './GameCard';

const GameList = ({ wallet, predictionGames, updateSnackbar, oracle }) => {
    console.log(predictionGames);

    return (
        <Box sx={{ my: 5 }}>
            <Container fixed>
                <Grid container spacing={2}>
                    {
                        predictionGames != null && predictionGames.map((game) => 
                            <Grid item xs={3}>
                                <GameCard key={game.address} wallet={wallet} game={game} updateSnackbar={updateSnackbar} oracle={oracle} />
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
        </Box>
    )
}

export default GameList;