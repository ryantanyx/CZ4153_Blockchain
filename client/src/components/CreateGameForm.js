import * as React from 'react';
import { Box, TextField, Typography, Stack, Grid, IconButton, Button, DialogTitle, Divider, Select, MenuItem, FormControl, FormHelperText, CircularProgress } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import SportsIdsMapping from '../blockchain/SportIdsMapping.json';
import { waitFulfilled } from '../blockchain/oracle.js';
import { getDateTimeString } from '../utils/helper.js';
import { getEmoji } from '../utils/text';

const CreateGameForm = ({ onCloseForm, oracle, predictionMarket, updateGames, updateSnackbar }) => {
    const [betTitle, setBetTitle] = React.useState("");
    const [choiceA, setChoiceA] = React.useState("");
    const [choiceB, setChoiceB] = React.useState("");
    const [expiryTime, setExpiryTime] = React.useState("");
    const [gameId, setGameId] = React.useState("");

    const [dateTimeValue, setDateTimeValue] = React.useState("");
    const [sport, setSport] = React.useState('');
    const [matches, setMatches] = React.useState([]);
    const [chosenGame, setChosenGame] = React.useState("");

    const [dateTimeErrorMessage, setDateTimeErrorMessage] = React.useState("");
    const [sportIdErrorMessage, setSportIdErrorMessage] = React.useState("");
    const [chooseMatchErrorMessage, setChooseMatchErrorMessage] = React.useState("");
    const [loadingSearch, setLoadingSearch] = React.useState(false);

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
        setDateTimeErrorMessage("");
        setSportIdErrorMessage("");
        setChooseMatchErrorMessage("");
    }

    // Update chosen game and reflect changes on FE
    const updateChosenGame = (e) => {
        setChosenGame(e);
        setBetTitle(e.homeTeam + " vs " + e.awayTeam + " (" + getDateTimeString(e.startTime.toString()) + ")");
        setChoiceA(e.homeTeam);
        setChoiceB(e.awayTeam);
        setExpiryTime(e.startTime.toString());
        setGameId(e.gameId);
    }

    // Call chainlink smart contract to search for games
    const searchGames = async () => {
        removeErrors();

        if (dateTimeValue === null || dateTimeValue === "") {
            // Expiry date cannot be empty
            setDateTimeErrorMessage("Please select a match timing!");
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
                const tx = await oracle.requestGames("create", sport.toString(), expiryEpoch.toString());
                console.log(tx);
                setLoadingSearch(true);
                const txReceipt = await tx.wait();
                console.log(txReceipt);
                const reqId = txReceipt.logs[0].topics[1];
                console.log(reqId);
                // Check if request has been fulfilled by chainlink
                await waitFulfilled(oracle, reqId);
                const result = await oracle.getGamesCreated(reqId);
                console.log(result);
                setMatches(result);
                setLoadingSearch(false);
            } catch (error) {
                console.log("Error: " + error.message);
            }
        }
    }

    // Create game - call API
    const createGame = async () => {
        removeErrors();
        if (chosenGame === "") {
            // Need to choose a match
            setChooseMatchErrorMessage("Please select a match!");
        } else {
            try {
                // Create payload
                const payload = {
                    betTitle: betTitle,
                    expiryDate: parseInt(expiryTime),
                    choiceA: choiceA,
                    choiceB: choiceB,
                    sportId: sport,
                    gameId: gameId
                }
                // Call smart contract
                const tx = await predictionMarket.createGame(payload);
                setLoadingSearch(true);
                await tx.wait();
                setLoadingSearch(false);
                // Update games on FE
                updateGames();
                // Close form
                closeCreateGameForm();
                // Trigger snackbar
                updateSnackbar("success", `Succesfully created game. Let the games begin! ${getEmoji(0x1F525)}${getEmoji(0x1F525)}${getEmoji(0x1F525)}`);
            } catch (error) {
                console.log("Error:" + error.message);
            }
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
                    <Box sx={{ width: "33%" }}>
                        <Typography fontWeight="700">Choice A</Typography>
                        <TextField
                            sx={{ width: "100%" }}
                            value={choiceA}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                    <Box sx={{ width: "33%" }}>
                        <Typography fontWeight="700">Choice B</Typography>
                        <TextField
                            sx={{ width: "100%" }}
                            value={choiceB}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Box>
                    <Box sx={{ width: "33%" }}>
                        <Typography fontWeight="700">Expiry Time</Typography>
                        <TextField
                            sx={{ width: "100%" }}
                            value={expiryTime}
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
                        <Typography fontWeight="700">Choose a Timing</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                            <DateTimePicker
                                renderInput={(props) => <TextField 
                                    {...props}
                                    error={dateTimeErrorMessage !== ""}
                                    id="outlined-error-helper-text"
                                    helperText={dateTimeErrorMessage}
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
                        <FormControl error={chooseMatchErrorMessage !== ""} sx={{ width: "100%" }} >
                            <Select sx={{ width: "100%" }} value={chosenGame} onChange={(e) => updateChosenGame(e.target.value)} >
                                { 
                                    matches.map(e => {
                                        return <MenuItem key={e.gameId} value={e}>{e.homeTeam} vs {e.awayTeam} ({getDateTimeString(e.startTime.toString())})</MenuItem>
                                    })
                                }
                            </Select>
                            {chooseMatchErrorMessage !== "" && <FormHelperText>{chooseMatchErrorMessage}</FormHelperText>}
                        </FormControl>
                    </Box>
                </Stack>
                <Grid container justifyContent="space-between">
                    <Box>
                        <Button 
                            variant="contained"
                            sx={{ my: 2, fontWeight: 700 }}
                            endIcon={<SearchIcon />}
                            onClick={searchGames} >
                            Search Games
                        </Button>
                        { loadingSearch ? <CircularProgress size='20px' sx={{ ml: 2 }} /> : "" }
                    </Box>
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