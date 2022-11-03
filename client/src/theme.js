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
    components: {
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    "&": {
                        color: "#fefefe"
                    },
                    "&.Mui-selected": {
                        color: "#000000",
                        backgroundColor: '#fefefe'
                    },
                    "&.Mui-selected:hover": {
                        color: "#000000",
                        backgroundColor: '#fefefe'
                    },
                    "&:hover": {
                        color: '#000000',
                        backgroundColor: '#fefefe'
                    }
                }
            }
        }
    }
});

export default theme;