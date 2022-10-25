import * as React from 'react';
import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import "./App.css";
import Navbar from "./components/Navbar";
import CreateGameForm from "./components/CreateGameForm";
import { Container, Box, Typography, Grid, CardMedia, Button, Card, CardContent, Dialog, IconButton } from '@mui/material';
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
      <Box sx={{ my: 10 }}>
        <Container fixed>
          <Grid container spacing={2}>
            <Grid xs={3}>
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Word of the Day
                  </Typography>
                  <Typography variant="h5" component="div">
                    benovelent
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    adjective
                  </Typography>
                  <Typography variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={3}>

            </Grid>
            <Grid xs={3}>

            </Grid>
            <Grid xs={3}>

            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
