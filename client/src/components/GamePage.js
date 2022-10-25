import * as React from 'react';
import { Stack, TextField, ButtonGroup, Button, Box, DialogTitle, IconButton, Grid, Typography, Container, TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const GamePage = ({ onClosePage }) => {
    const [choice, setChoice] = React.useState(true);

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
                <Typography fontWeight="700" variant="h4">Who will win the F1 Driver's Championship?</Typography>
                <Box
                    height={30}
                    mt={2}
                    style={{ background: 'linear-gradient(to right, #12892193 90%, #FA121193 10%)' }}
                    sx={{ borderRadius: 1 }}>
                    <Grid container justifyContent="space-between" alignItems="center" height="100%">
                        <Typography variant="h5" fontWeight={600} ml={1} >Max Verstappen $0.90</Typography>
                        <Typography variant="h5" fontWeight={600} mr={1}>Charles Leclerc $0.10</Typography>
                    </Grid>
                    <Grid container justifyContent="flex-end">
                        <Typography>Total Pool: $34634576</Typography>
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
                                        <TableCell><strong>Quantity</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Max Verstappen</TableCell>
                                        <TableCell>1242356</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Charles Leclerc</TableCell>
                                        <TableCell>2356</TableCell>
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
                                <Button color={getButtonColor(true)} onClick={() => selectChoice(true)}>Max</Button>
                                <Button color={getButtonColor(false)} onClick={() => selectChoice(false)}>Charles</Button>
                            </ButtonGroup>
                            <Typography variant="h6" align="left" sx={{ width: '75%' }}>Quantity</Typography>
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