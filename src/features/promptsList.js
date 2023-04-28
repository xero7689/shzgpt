import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Divider, Typography, Collapse, List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';

const PromptItem = (props) => {
    const [showContent, setShowContent] = useState(false);
    const { prompt } = props;

    const handleMouseEnter = () => {
        setShowContent(true);
    };

    const handleMouseLeave = () => {
        setShowContent(false);
    };

    const handleMouseClick = async () => {
        return await navigator.clipboard.writeText(prompt.content)
    }

    return (
        <ListItem key="index" display="flex" flexDirection="column" color="primary.contrastText"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleMouseClick}
        >
            <ListItemButton>
                <Typography variant='subtitle' color="primary.contrastText">{prompt.title}</Typography>
                {showContent &&
                    <Box sx={{
                        position: 'absolute',
                        top: '100%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'primary.main',
                        borderRadius: '4px',
                        border: '1px solid',
                        borderColor: 'primary.border',
                        padding: "16px"
                    }}
                        maxWidth="571px"
                        zIndex="9998"
                    >
                        <Typography variant='body' color="primary.contrastText">
                            {prompt.content}
                        </Typography>
                    </Box>
                }
            </ListItemButton>
        </ListItem>
    )
}

export const PromptsList = () => {
    const prompts = useSelector(state => state.prompts);

    const renderedPosts = prompts.prompts.map((prompt, index) => (
        <PromptItem key={index} prompt={prompt} />
    ));

    return (
        <Box
            display="flex"
            flexDirection="column"
            px={2}
            py={2}
            sx={{
                backgroundColor: "primary.main",
                borderLeft: "1px solid",
                borderColor: "primary.border"
            }}
        >
            <Box>
                <Typography color="primary.contrastText" fontSize="normal" fontWeight="bold" textAlign="center">Prompts</Typography>
            </Box>
            <Divider></Divider>
            <Box component="nav">
                <List>
                    {renderedPosts}
                </List>
            </Box>
        </Box>
    )
}