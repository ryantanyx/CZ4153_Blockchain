import * as React from 'react';
import { Container, Box, Grid, Dialog } from '@mui/material';
import GameCard from './GameCard';
import GamePage from './GamePage';

const GameList = () => {
    const [openGame, setOpenGame] = React.useState(false);
    const [games, setGames] = React.useState([]);

    return (
        <Box sx={{ my: 10 }}>
            <Container fixed>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <GameCard onClickOpenGame={setOpenGame} />
                    </Grid>
                    <Grid item xs={3}>
                        <GameCard onClickOpenGame={setOpenGame} />
                    </Grid>
                    <Grid item xs={3}>
                        <GameCard onClickOpenGame={setOpenGame} />
                    </Grid>
                    <Grid item xs={3}>
                        <GameCard onClickOpenGame={setOpenGame} />
                    </Grid>
                    <Grid item xs={3}>
                        <GameCard onClickOpenGame={setOpenGame} />
                    </Grid>
                </Grid>
            </Container>
            <Dialog open={openGame} fullWidth={true} maxWidth="md">
                <GamePage onClosePage={setOpenGame} />
            </Dialog>
        </Box>
    )
}

export default GameList;