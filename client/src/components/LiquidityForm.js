import * as React from 'react';
import { Box, Grid, DialogTitle, IconButton, Stack, Typography, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { isInt } from '../utils/math.js';
import { getEmoji } from '../utils/text.js';

const LiquidityForm = ({ wallet, onCloseForm, game, initialiseLiquidity, triggerSnackbar }) => {
    const [liquidity, setLiquidity] = React.useState("0");
    const [errorMessage, setErrorMessage] = React.useState("");

    // Close the form
    const closeLiquidityForm = React.useCallback(() => {
        onCloseForm(false);
    }, [onCloseForm]);

    // Call smart contract to add liquidity
    const addLiquidity = async () => {
        setErrorMessage("");

        if (liquidity === "" || liquidity === null || liquidity === "0") {
            // Check if blank or zero
            setErrorMessage("Please enter a non-zero value!")
        } else if (!isInt(liquidity)) {
            // Check if decimal
            setErrorMessage("Number of Wei cannot be a decimal!")
        } else {
            try {
                // Call smart contract
                await game.provideLiquidity({value: liquidity});
                // Get new total pot
                const totalPot = (await game.totalPot()).toString();
                // Update liquidity initialised in GameCard
                initialiseLiquidity(totalPot);
                // Close form
                closeLiquidityForm();
                // Open success snackbar
                triggerSnackbar("success", `Liquidity added! Players can now place bets on your game! ${getEmoji(0x1F525)}${getEmoji(0x1F525)}${getEmoji(0x1F525)}`);
            } catch (error) {
                console.log("Error: " + error.message);
            }
        }
    }

    return (
        <Box component="form" sx={{ mx: 2}}>
            <Grid container justifyContent="space-between" >
                <DialogTitle variant="h5" fontWeight="700" >Add Liquidity</DialogTitle>
                <IconButton onClick={closeLiquidityForm} >
                    <CloseIcon />
                </IconButton>
            </Grid>
            <Stack spacing={2} px={3} >
                <Box>
                    <Typography fontWeight="700">Liquidity (in Wei): </Typography>
                    <TextField 
                        error={errorMessage !== ""}
                        fullWidth
                        type="number"
                        id="outlined-error-helper-text"
                        helperText={errorMessage}
                        onChange={(e) => setLiquidity(e.target.value)}
                    />
                </Box>
                <Grid container justifyContent="flex-end">
                    <Button 
                        variant="contained"
                        color="success"
                        sx={{ my: 2, fontWeight: 700 }}
                        endIcon={<SendIcon />}
                        onClick={addLiquidity} >
                        Add Liquidity
                    </Button>
                </Grid>
            </Stack>
        </Box>
    )
}

export default LiquidityForm;