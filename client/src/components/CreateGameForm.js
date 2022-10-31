import * as React from 'react';
import { Box, TextField, Typography, Stack, Grid, IconButton, Button, DialogTitle, Divider, Select, MenuItem, FormControl, FormHelperText } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import SportsIdsMapping from '../blockchain/SportIdsMapping.json';

const CreateGameForm = ({ onCloseForm, oracle }) => {
    const [betTitle, setBetTitle] = React.useState("");
    const [choiceA, setChoiceA] = React.useState("Yes");
    const [choiceB, setChoiceB] = React.useState("No");
    const [dateTimeValue, setDateTimeValue] = React.useState("");
    const [sport, setSport] = React.useState('');
    const [matches, setMatches] = React.useState([]);

    const [expiryDateErrorMessage, setExpiryDateErrorMessage] = React.useState("");
    const [sportIdErrorMessage, setSportIdErrorMessage] = React.useState("");

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
        setExpiryDateErrorMessage("");
        setSportIdErrorMessage("");
    }

    // Call chainlink smart contract to search for games
    const searchGames = async () => {
        removeErrors();

        if (dateTimeValue === null || dateTimeValue === "") {
            // Expiry date cannot be empty
            setExpiryDateErrorMessage("Please select an expiry datetime!");
        } else if (!SportsIdsMapping.ids.includes(sport)) {
            // Must pick a valid sport id
            setSportIdErrorMessage("Please select a sport!");
        } else {
            try {
                // Convert datetime to unix timestamp
                const expiryEpoch = new Date(dateTimeValue.$y, dateTimeValue.$M, dateTimeValue.$D, dateTimeValue.$H, dateTimeValue.$m, dateTimeValue.$s).getTime() / 1000;
                console.log(expiryEpoch);
                console.log(sport);
                // Call smart contract
                const tx = await oracle.requestGames("100000000000000000", "create", sport.toString(), expiryEpoch.toString());
                console.log(tx);
                const txReceipt = await tx.wait();
                console.log(txReceipt);
                const reqId = txReceipt.logs[0].topics[0];
                console.log(reqId);
                await new Promise(r => setTimeout(r, 100000));
                const result = await oracle.getGamesCreated(reqId);
                console.log(result);
            } catch (error) {
                console.log("Error:" + error.message);
            }
        }
    }

    // Create game - call API
    const createGame = () => {
        removeErrors();
        if (dateTimeValue === null) {
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
                <Typography variant="h6" fontWeight="700">Bet Details:</Typography>
                <Box>
                    <Typography fontWeight="700">Bet Title</Typography>
                    <TextField
                        fullWidth
                        value={betTitle}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
                <Stack direction="row" spacing={2} style={{ display: "flex" }} >
                    <Box sx={{ width: "50%" }}>
                        <Typography fontWeight="700">Choice A</Typography>
                        <TextField
                            sx={{ width: "100%" }}
                            value={choiceA}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                    <Box sx={{ width: "50%" }}>
                        <Typography fontWeight="700">Choice B</Typography>
                        <TextField
                            sx={{ width: "100%" }}
                            value={choiceB}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                </Stack>
                <Divider variant="middle" />
                <Typography variant="h6" fontWeight="700">Select a game here:</Typography>
                <Stack direction="row" spacing={2} style={{ display: "flex" }} >
                    <Box sx={{ width: "25%" }}>
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
                                onChange={(newValue) => setDateTimeValue(newValue)}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ width: "25%" }}>
                        <Typography fontWeight="700">Game</Typography>
                        <FormControl error={sportIdErrorMessage !== ""} sx={{ width: "100%" }} >
                            <Select value={sport} onChange={(e) => setSport(e.target.value)} >
                                { 
                                    SportsIdsMapping.sports.map(i => {
                                        return <MenuItem key={i} value={SportsIdsMapping.mapping[i]}>{i}</MenuItem>
                                    })
                                }
                            </Select>
                            {sportIdErrorMessage !== "" && <FormHelperText>{sportIdErrorMessage}</FormHelperText>}
                        </FormControl>
                    </Box>
                    <Box sx={{ width: "50%" }}>
                        <Typography fontWeight="700">Match</Typography>
                        <Select sx={{ width: "100%" }} value={sport} onChange={(e) => setSport(e.target.value)} >
                            { 
                                matches.map(i => {
                                    return <MenuItem key={i} value={i}>{i}</MenuItem>
                                })
                            }
                        </Select>
                    </Box>
                </Stack>
                <Grid container justifyContent="space-between">
                    <Button 
                        variant="contained"
                        sx={{ my: 2, fontWeight: 700 }}
                        endIcon={<SearchIcon />}
                        onClick={searchGames} >
                        Search Games
                    </Button>
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