import * as React from 'react';
import { Typography, Card, CardContent, CardActions, Button, Box, Grid } from '@mui/material';

const GameCard = ({ onClickOpenGame, game }) => {
    const [betTitle, setBetTitle] = React.useState(undefined);

    const openGame = React.useCallback(() => {
        onClickOpenGame(true);
    }, [onClickOpenGame]);

    return(
        <Card>
            <CardContent>
                <Typography fontWeight={700} sx={{ fontSize: 14 }} gutterBottom>
                    Who will win the F1 Driver's Championship?
                </Typography>
                <Box 
                    mt={2}
                    style={{ background: 'linear-gradient(to right, #12892193 90%, #FA121193 30%)' }}
                    sx={{ borderRadius: 1 }}>
                    <Grid container justifyContent="space-between">
                        <Typography fontWeight={600} ml={1} >Max Verstappen</Typography>
                        <Typography fontWeight={600} mr={1}>Charles Leclerc</Typography>
                    </Grid>
                </Box>
                <Typography mt={1}>Total Pool: $2356246</Typography>
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