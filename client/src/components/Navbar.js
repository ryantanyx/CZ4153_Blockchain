import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Navbar = () => {

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                <Button>
                    <AccountBalanceIcon color="secondary" fontSize="large" />
                    <Typography fontWeight="700" variant="h4" component="div" color="secondary" sx={{ flexGrow: 1, ml: 2, textTransform: 'none' }}>
                        MOZART
                    </Typography>
                </Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar