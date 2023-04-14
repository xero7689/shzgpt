import { forwardRef } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function GPTAppBar(props, ref) {
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
            </Toolbar>
        </AppBar>
    )
}

export default forwardRef(GPTAppBar);