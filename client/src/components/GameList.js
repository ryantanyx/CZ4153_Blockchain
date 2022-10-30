import * as React from 'react';
import { Container, Box, Grid } from '@mui/material';
import GameCard from './GameCard';

const GameList = ({ wallet, predictionGames }) => {
    console.log(predictionGames);

    return (
        <Box sx={{ my: 10 }}>
            <Container fixed>
                <Grid container spacing={2}>
                    {
                        predictionGames != null && predictionGames.map((game) => 
                            <Grid item xs={3}>
                                <GameCard wallet={wallet} game={game} />
                            </Grid>
                        )
                    }
                </Grid>
            </Container>
        </Box>
    )
}

export default GameList;