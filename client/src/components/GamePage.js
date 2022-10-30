import * as React from 'react';
import { Stack, TextField, ButtonGroup, Button, Box, DialogTitle, IconButton, Grid, Typography, Container, TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getBarBackground } from '../utils/helper.js';
import { getToken, getTokenBalance } from '../blockchain/token.js'

const GamePage = ({ onClosePage, game, gameInfo, wallet }) => {
    const [choice, setChoice] = React.useState(true);
    const [bets, setBets] = React.useState(undefined);

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
    }, [game]);

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

    return (
        <Box>
            <Grid container justifyContent="space-between" >
                <DialogTitle variant="h5" fontWeight="700" >Make a Bet</DialogTitle>
                <IconButton onClick={closeGamePage} >
                    <CloseIcon />
                </IconButton>
            </Grid>
            <Container>
                <Typography fontWeight="700" variant="h4">{gameInfo.betTitle}</Typography>
                <Box
                    height={30}
                    mt={2}
                    style={{ background: getBarBackground(gameInfo) }}
                    sx={{ borderRadius: 1 }}>
                    <Grid container justifyContent="space-between" alignItems="center" height="100%">
                        <Typography variant="h5" fontWeight={600} ml={1} >{gameInfo.choiceA} $0.90</Typography>
                        <Typography variant="h5" fontWeight={600} mr={1}>{gameInfo.choiceB} $0.10</Typography>
                    </Grid>
                    <Grid container justifyContent="flex-end">
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
                                        <TableCell>{bets.A}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{gameInfo.choiceB}</TableCell>
                                        <TableCell>{bets.B}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                            <TextField type="number" size="small" sx={{ width: '75%' }} />
                            <Button variant="contained" sx={{ width: '75%' }}>Buy</Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default GamePage;