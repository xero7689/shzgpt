import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
    palette: {
        primary: {
            main: '#282828',
            border: '#3c3836',
            contrastText: '#ebdbb2'
        },
        secondary: {
            main: '#458588',
            light: '#d4d5d5',
            contrastText: '#d4d5d5',
        },
        thirdary: {
            main: '#689d6a'
        },
        info: {
            main: '#3c3836',
            border: '#504945',
            contrastText: '#ebdbb2',
        },
        background: {
            default: '#1d2021',
            paper: '#282828'
        }
    }
});

export const lightTheme = createTheme({
    palette: {
        primary: {
            main: '#fbf1c7',
            border: '#928374',
            contrastText: '#3c3836'
        },
        secondary: {
            main: '#458588',
            light: '#d4d5d5',
            contrastText: '#d4d5d5',
        },
        thirdary: {
            main: '#689d6a'
        },
        info: {
            main: '#3c3836',
            border: '#504945',
            contrastText: '#ebdbb2',
        },
        background: {
            default: '#1d2021',
            paper: '#282828'
        }
    }
});