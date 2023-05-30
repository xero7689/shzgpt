import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchGPTMessage } from './chatRoomSlice';
import { Box } from '@mui/material';

export const ChatHistoryTest = (props) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGPTMessage());
    })

    return (
        <Box>
            <p>chatHistoryTest</p>
        </Box>
    )
}