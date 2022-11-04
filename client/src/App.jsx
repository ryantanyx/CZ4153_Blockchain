import * as React from 'react';
import { EthProvider } from "./contexts/EthContext";

import "./App.css";
import Navbar from "./components/Navbar";
import CreateGameForm from "./components/CreateGameForm";
import GameList from "./components/GameList";
import { Container, Box, Typography, Grid, CardMedia, Button, Dialog, CircularProgress, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import banner from "./banner.jpg";
import ape from "./ape.jpg";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { getBlockchain } from './blockchain/ethereum.js';
import { fetchGames } from './blockchain/predictionGame.js';
import SnackBar from './components/SnackBar.js';

function App() {
  const [open, setOpen] = React.useState(false);
  const [userAddress, setUserAddress] = React.useState(undefined);
  const [predictionMarket, setPredictionMarket] = React.useState(undefined);
  const [oracle, setOracle] = React.useState(undefined);
  const [predictionGames, setPredictionGames] = React.useState(undefined);

  // Initialisation
  React.useEffect(() => {
    const init = async () => {
      const { signerAddress, predictionMarket, oracle } = await getBlockchain();
      setPredictionMarket(predictionMarket);
      setUserAddress(signerAddress);
      setOracle(oracle);

      console.log(predictionMarket);
      console.log(oracle);
      console.log(signerAddress);

      // Get all the prediction games
      const predictionGames = await fetchGames(predictionMarket);
      setPredictionGames(predictionGames);
    }
    init();
  }, []);

  // Snackbar
  const [snackbarInfo, setSnackbarInfo] = React.useState(undefined);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const updateSnackbar = (severity, message) => {
      const snackbarInfo = {
          severity: severity,
          message: message
      };
      setSnackbarInfo(snackbarInfo);
      setOpenSnackbar(true);
  }
  const handleCloseSnackbar = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setOpenSnackbar(false);
  };

  // Refetch and update prediction games list
  const updateGames = async () => {
    const predictionGames = await fetchGames(predictionMarket);
    setPredictionGames(predictionGames);
  }

  // Function to open the create game form
  const openCreateGameForm = () => {
    setOpen(true);
  }

  // Do not render page until all states initialised
  if (typeof predictionMarket === 'undefined' || typeof oracle === 'undefined' || typeof userAddress === 'undefined') {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Stack item xs={3} container justify="center" alignItems="center" spacing={3}>
          <AccountBalanceIcon color="secondary" fontSize="large" sx={{ width: "50px", height: "50px" }} />
          <Typography fontWeight="700" variant="h1" color="secondary">
            MOZART
          </Typography>
          <CircularProgress color="secondary"/>
          <Typography color="secondary">Connect your metamask wallet</Typography>
        </Stack>   
      </Grid> 
    )
  }

  return (
    <Box pb={5}>
      <Navbar wallet={userAddress} />
      <Box>
        <Container fixed>
          <Grid container spacing={2} sx={{ my: 3 }} alignItems="center">
            <Grid xs={6}>
              <Box>
                <Typography variant="h1" component="div" color="secondary" fontWeight="800">
                  WELCOME TO MOZART
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" component="div" color="secondary" sx={{ display: "block" }}>
                  Know something others don't? Why not profit from it? Make your bets now!
                </Typography>
              </Box>
              <Button variant="contained" color="success" sx={{ my: 2, fontWeight: 700 }} endIcon={<SendIcon />} onClick={openCreateGameForm} >
                Or Click Here to Create Your Own Prediction Game
              </Button>
            </Grid>
            <Grid xs={6}>
              <CardMedia
                alt="title"
                component="img"
                height="400"
                image={ape}
                sx={{ borderRadius: 3 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Dialog open={open} fullWidth={true} maxWidth="md">
        <CreateGameForm onCloseForm={setOpen} oracle={oracle} predictionMarket={predictionMarket} updateGames={updateGames} updateSnackbar={updateSnackbar} />
      </Dialog>
      <GameList wallet={userAddress} predictionGames={predictionGames} updateSnackbar={updateSnackbar} oracle={oracle} />
      { snackbarInfo && <SnackBar severity={snackbarInfo.severity} message={snackbarInfo.message} openSnackbar={openSnackbar} handleCloseSnackbar={handleCloseSnackbar} /> }
    </Box>
  );
}

export default App;
