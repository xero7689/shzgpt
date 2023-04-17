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

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.05),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.15),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));


function GPTAppBar(props, ref) {

    const { setToggleSidePanel } = props;

    const handleClick = () => {
        setToggleSidePanel(toggle => !toggle);
        console.log("Handle Click!")
    }

    return (
        <AppBar position="fixed"
            sx={{
                backgroundColor: '#1d1f27'
            }}
            ref={ref}
        >
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleClick}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    fontWeight="bold"
                >
                    SHZ GPT
                </Typography>

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
                                    <SearchIcon sx={{ color: "#7e7f87" }} />
                                </InputAdornment>
                            ),
                        }}
                        variant='outlined'
                        sx={{
                            input: {
                                color: '#bdbec2'
                            },
                            fieldset: {
                                borderColor: "#7e7f87"
                            },
                        }}
                    >
                        Search
                    </TextField>
                </Search>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: { xs: 'flex'} }}>
                    <IconButton
                        size="large"
                        aria-label="show more"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <SettingsIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default forwardRef(GPTAppBar);