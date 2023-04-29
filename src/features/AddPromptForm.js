import React, { useState } from 'react';
import { useDispatch } from 'react-redux'

import { Box, Typography, TextField, Button } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';

import { promptAdded } from './promptsSlice';

export const AddPromptForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const dispatch = useDispatch();

    const onSavePromptClicked = () => {
        if (title && content) {
            dispatch(promptAdded(title, content))
            setTitle('')
            setContent('')
        }
        setTitle('');
        setContent('');
    }
    const canSave = Boolean(title) && Boolean(content)

    const onTitleChanged = e => setTitle(e.target.value);
    const onContentChanged = e => setContent(e.target.value);

    return (
        <Box display="flex" flexDirection="column" p={1}>
            <Box component="form" display="flex" flexDirection="column" gap={1}>
                <TextField
                    type="text"
                    size="small"
                    label="Prompt Title..."
                    id="promptTitle"
                    name="promptTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <TextField
                    id="promptContent"
                    label="Prompt Content..."
                    name="promptContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <Button variant='contained' disabled={!canSave} onClick={onSavePromptClicked}>
                    Save Prompt
                </Button>
            </Box>
        </Box>
    )
}