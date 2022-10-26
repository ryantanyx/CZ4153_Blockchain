import * as React from 'react';
import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import "./App.css";
import Navbar from "./components/Navbar";
import CreateGameForm from "./components/CreateGameForm";
import GameList from "./components/GameList";
import { Container, Box, Typography, Grid, CardMedia, Button, Dialog } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import banner from "./banner.jpg";

function App() {
  const [open, setOpen] = React.useState(false);

  const openCreateGameForm = () => {
    setOpen(true);
  }

  return (
    <Box>
      <Navbar />
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
                image={banner}
                sx={{ borderRadius: 3 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Dialog open={open} fullWidth={true} maxWidth="md">
        <CreateGameForm onCloseForm={setOpen} />
      </Dialog>
      <GameList />
    </Box>
  );
}

export default App;
