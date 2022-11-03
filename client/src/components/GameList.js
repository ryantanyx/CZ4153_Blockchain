import * as React from 'react';
import { Container, Box, Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';
import GameCard from './GameCard';

const GameList = ({ wallet, predictionGames, updateSnackbar, oracle }) => {
    // Toggle button
    const [alignment, setAlignment] = React.useState('1');
    const handleTabChange = (event, newAlignment) => {
        setAlignment(newAlignment);
    }

    console.log(predictionGames);

    // Display items
    const [gamesToDisplay, setGamesToDisplay] = React.useState(predictionGames);
    React.useEffect(() => {
        if (alignment === "1") {
            setGamesToDisplay(predictionGames);
        } else if (alignment === "2") {
            const gamesToDisplay = [];
            // TODO: Continue this toggle thing
        }
    }, [alignment]);

    return (
        <Box sx={{ my: 5 }}>
            <Container fixed sx={{ display: "flex", justifyContent: "center", mb: 2 }} >
                <ToggleButtonGroup
                    exclusive
                    value={alignment}
                    onChange={handleTabChange}
                    style={{ border: "1px solid #fefefe" }}
                >
                    <ToggleButton value="1">All Games</ToggleButton>
                    <ToggleButton value="2">My Games</ToggleButton>
                </ToggleButtonGroup>
            </Container>
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