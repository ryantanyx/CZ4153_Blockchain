import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    status: {
    danger: '#e53e3e',
    },
    palette: {
        primary: {
            main: '#1F2833',
            darker: '#121212',
        },
        secondary: {
            // main: "#66FCF1",
            main: "#FFF",
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
    },
});

export default theme;