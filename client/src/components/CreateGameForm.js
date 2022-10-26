import * as React from 'react';
import { Box, TextField, Typography, Stack, Grid, IconButton, Button, DialogTitle } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';

const CreateGameForm = ({ onCloseForm }) => {
    const [betTitle, setBetTitle] = React.useState("");
    const [choiceA, setChoiceA] = React.useState("");
    const [choiceB, setChoiceB] = React.useState("");
    const [dateTimeValue, setDateTimeValue] = React.useState(undefined);

    const [betTitleErrorMessage, setBetTitleErrorMessage] = React.useState("");
    const [choiceAErrorMessage, setChoiceAErrorMessage] = React.useState("");
    const [choiceBErrorMessage, setChoiceBErrorMessage] = React.useState("");
    const [expiryDateErrorMessage, setExpiryDateErrorMessage] = React.useState("");

    // Close the Form
    const closeCreateGameForm = React.useCallback(() => {
        onCloseForm(false);
        setBetTitle("");
        setChoiceA("");
        setChoiceB("");
        setDateTimeValue(null);
    }, [onCloseForm]);

    // Remove errors
    const removeErrors = () => {
        setBetTitleErrorMessage("");
        setChoiceAErrorMessage("");
        setChoiceBErrorMessage("");
        setExpiryDateErrorMessage("");
    }

    // Create game - call API
    const createGame = () => {
        removeErrors();
        if (betTitle === "") {
            setBetTitleErrorMessage("Bet title cannot be empty!")
        } else if (choiceA === "") {
            setChoiceAErrorMessage("Choice A cannot be empty!")
        } else if (choiceB === "") {
            setChoiceBErrorMessage("Choice B cannot be empty!")
        } else if (choiceA === choiceB) {
            setChoiceBErrorMessage("Choice B cannot be same as Choice A!")
        } else if (dateTimeValue === null) {
            setExpiryDateErrorMessage("Please select an expiry datetime!")
        }
    }

    return (
        <Box component="form" sx={{ mx: 2 }}>
            <Grid container justifyContent="space-between" >
                <DialogTitle variant="h5" fontWeight="700" >Create a New Prediction Game</DialogTitle>
                <IconButton onClick={closeCreateGameForm} >
                    <CloseIcon />
                </IconButton>
            </Grid>
            <Stack spacing={2} px={3}>
                <Box>
                    <Typography fontWeight="700">Bet Title</Typography>
                    <TextField
                        error={betTitleErrorMessage !== ""}
                        fullWidth
                        id="outlined-error-helper-text"
                        helperText={betTitleErrorMessage}
                        onChange={(e) => setBetTitle(e.target.value)}
                    />
                </Box>
                <Box>
                    <Typography fontWeight="700">Choice A</Typography>
                    <TextField
                        error={choiceAErrorMessage !== ""}
                        sx={{ width: "50%" }}
                        id="outlined-error-helper-text"
                        helperText={choiceAErrorMessage}
                        onChange={(e) => setChoiceA(e.target.value)}
                    />
                </Box>
                <Box>
                    <Typography fontWeight="700">Choice B</Typography>
                    <TextField
                        error={choiceBErrorMessage !== ""}
                        sx={{ width: "50%" }}
                        id="outlined-error-helper-text"
                        helperText={choiceBErrorMessage}
                        onChange={(e) => setChoiceB(e.target.value)}
                    />
                </Box>
                <Box>
                    <Typography fontWeight="700">Expiry Date</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DateTimePicker
                            renderInput={(props) => <TextField 
                                {...props}
                                error={expiryDateErrorMessage !== ""}
                                id="outlined-error-helper-text"
                                helperText={expiryDateErrorMessage}
                            />}
                            value={dateTimeValue}
                            onChange={(newValue) => {
                                setDateTimeValue(newValue);
                                console.log(newValue);
                            }}
                        />
                    </LocalizationProvider>
                </Box>
                <Grid container justifyContent="flex-end">
                    <Button 
                        variant="contained"
                        color="success"
                        sx={{ my: 2, fontWeight: 700 }}
                        endIcon={<SendIcon />}
                        onClick={createGame} >
                        Create Game
                    </Button>
                </Grid>
            </Stack>
        </Box>
    )
}

export default CreateGameForm;