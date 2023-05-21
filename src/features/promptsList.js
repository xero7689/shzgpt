import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllPrompts, fetchPrompts } from './promptsSlice';
import { fetchPromptTopic } from './promptTopicSlice';
import { Box, Divider, Typography, Collapse, List, ListItem, ListItemButton, ListItemText, ListItemIcon, CircularProgress } from '@mui/material';
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
        <ListItem key="index" color="primary.contrastText"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleMouseClick}
        >
            <ListItemButton>
                <Typography variant='subtitle' color="primary.contrastText">{prompt.name}</Typography>
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

export const PromptsList = (props) => {
    const dispatch = useDispatch();
    const prompts = useSelector(selectAllPrompts);
    const fetchError = useSelector(state => state.prompts.error);

    const fetchPromptStatus = useSelector(state => state.prompts.status);
    const fetchPromptTopicStatus = useSelector(state => state.promptTopic.status);

    useEffect(() => {
        if (fetchPromptStatus === 'idle') {
            dispatch(fetchPrompts());
        }
    }, [fetchPromptStatus, dispatch])

    useEffect(() => {
        if (fetchPromptTopicStatus === 'idle') {
            dispatch(fetchPromptTopic());
        }
    }, [fetchPromptTopicStatus, dispatch])

    let renderedPosts;

    if (fetchPromptStatus === 'loading') {
        renderedPosts = <CircularProgress />;
    } else if (fetchPromptStatus === 'succeeded') {
        renderedPosts = prompts.prompts.map((prompt, index) => {
            return (
                <PromptItem key={index} prompt={prompt} />
            )
        });
    } else if (fetchPromptStatus === 'failed') {
        renderedPosts = <Box>{fetchError}</Box>
    }


    return (
        <Box
            flexDirection="column"
            flexGrow={1}
        >
            <Box>
                <Typography color="primary.contrastText" fontSize="medium" fontWeight="bold" textAlign="center">Prompts</Typography>
            </Box>
            <Divider sx={{ marginTop: "16px" }}></Divider>
            <Box component="nav">
                <List>
                    {renderedPosts}
                </List>
            </Box>
        </Box>
    )
}