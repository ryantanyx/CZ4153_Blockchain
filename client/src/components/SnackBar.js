import * as React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const SnackBar = ({ severity, message, openSnackbar, handleCloseSnackbar }) => {

    return (
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} TransitionComponent={Slide} >
            <Alert onClose={handleCloseSnackbar} severity={severity} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default SnackBar;