import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { addNewPrompt } from './promptsSlice';
import { selectAllPromptTopic } from './promptTopicSlice';

import { Box, Typography, TextField, Button, FormControl, Select, MenuItem } from '@mui/material';


export const AddPromptForm = () => {
    const [topic, setTopic] = useState('');
    const [name, setName] = useState('');
    const [content, setContent] = useState('');

    const promptTopic = useSelector(selectAllPromptTopic);

    const [addRequestStatus, setAddRequestStatus] = useState('idle');

    const dispatch = useDispatch();

    const canSave = [name, content].every(Boolean) && addRequestStatus === 'idle';
    const onSavePromptClicked = async () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending');
                await dispatch(addNewPrompt({ prompt_topic: topic, name: name, content: content })).unwrap();
                setName('');
                setContent('');

            } catch (err) {
                console.error("Failed to save the prompts: ", err);
            } finally {
                setAddRequestStatus('idle');
            }
            setName('');
            setContent('');
        }
    }

    const onTopicChanged = e => setTopic(e.target.value);
    const onNameChanged = e => setName(e.target.value);
    const onContentChanged = e => setContent(e.target.value);

    return (
        <Box display="flex" flexDirection="column" p={1}>
            <Box component="form" display="flex" flexDirection="column" gap={1}>
                <Select defaultValue='' onChange={onTopicChanged}>
                    { promptTopic.promptTopic.map((topic, index) => {
                        return (
                            <MenuItem key={index} value={topic.id}>
                                {topic.name}
                            </MenuItem>
                        )
                    }) }
                </Select>
                <TextField
                    type="text"
                    size="small"
                    label="Prompt Name..."
                    id="promptName"
                    name="promptName"
                    value={name}
                    onChange={onNameChanged}
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