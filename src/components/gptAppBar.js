import { forwardRef } from 'react';

import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';

import { useDispatch } from "react-redux";
import { toggleSettingsModal } from '../features/settingsSlice';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.15),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
}));


function GPTAppBar(props, ref) {
    const { setToggleSidePanel, setColorMode } = props;
    const theme = useTheme();
    const dispatch = useDispatch()

    const handleClick = () => {
        setToggleSidePanel(toggle => !toggle);
    }

    const handleSwitchColorMode = () => {
        setColorMode(preMode => preMode === "light" ? "dark" : "light");
    }

    const handleSettingsClick = () => {
        dispatch(toggleSettingsModal());
    }

    return (
        <AppBar
            position='static'
            elevation={0}
            sx={{
                borderBottom: "1px solid",
                borderColor: theme.palette.primary.border
            }}
            ref={ref}
        >
            <Toolbar>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Box display="flex" alignItems="center">
                        <IconButton
                            sx={{
                                color: "primary.contrastText"
                            }}
                            onClick={handleClick}
                        >
                            <MenuIcon fontSize='small' />
                        </IconButton>

                        <Typography
                            display={{
                                xs: "none",
                                sm: "block"
                            }}
                            color="primary.contrastText"
                            fontSize="normal"
                            noWrap
                            component="div"
                            fontWeight="bold"
                            ml={2}
                        >
                            SHZ GPT
                        </Typography>
                    </Box>
                    <Box>
                        <Search>
                            <TextField
                                size="small"
                                InputLabelProps={{
                                    style: {
                                        color: '#939fa5'
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: "primary.contrastText" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                variant='outlined'
                                sx={{
                                    input: {
                                        color: '#bdbec2'
                                    },
                                    fieldset: {
                                        borderColor: "primary.border"
                                    },
                                }}
                            >
                                Search
                            </TextField>
                        </Search>
                    </Box>
                    <Box sx={{ display: { xs: 'flex' } }}>
                        <IconButton sx={{ color: "primary.contrastText" }} onClick={handleSwitchColorMode}>
                            {theme.palette.mode === 'dark' ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
                        </IconButton>
                        <IconButton
                            onClick={handleSettingsClick}
                            aria-label="show more"
                            aria-haspopup="true"
                            sx={{
                                color: "primary.contrastText"
                            }}
                        >
                            <SettingsIcon fontSize='small' />
                        </IconButton>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default forwardRef(GPTAppBar);