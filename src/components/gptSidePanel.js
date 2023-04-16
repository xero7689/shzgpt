import { useState, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { TextField, Button, Typography, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

import { getChatRoom, getChatHistory, createChatRoom, postChat } from '../fetchers/storage';

const GPTSidePanel = (props) => {
    const { setChatHistory, setCurrentChatRoom, toggleSidePanel } = props;

    const newChatRoomRef = useRef();
    const [chatRooms, setChatRooms] = useState([]);
    const [newChatRoomName, setNewChatRoomName] = useState("");
    const [newChatRoomNameInput, setNewChatRoomNameInput] = useState("");


    useEffect(() => {
        async function fetchChatRoom() {
            const response = await getChatRoom();
            setChatRooms(response.results);
        }
        fetchChatRoom();
    }, [])

    useEffect(() => {
        async function fetchChatRoom() {
            const response = await getChatRoom();
            setChatRooms(response.results);
        }
        fetchChatRoom();
    }, [newChatRoomName])

    const handleOnChange = (event) => {
        setNewChatRoomNameInput(event.target.value);
    }

    const handleSubmitNewChatRoom = async () => {
        const response = await createChatRoom(newChatRoomNameInput);
        setChatRooms(preChatroom => [...preChatroom, response]);
        setNewChatRoomName(response.name);
        setCurrentChatRoom(response.id);

        postChat(response.id, "system", "You're a helpful assistance.");
    }

    function convertData(data) {
        if (data.length === 0) return data;

        return data.map(({ role, content, created_at }) => {
            const date = new Date(created_at);
            const timestamp = date.getTime();

            return {
                timestamp,
                role,
                content,
            };
        }).sort((a, b) => a.timestamp - b.timestamp);;
    }

    const handleOnClickRoom = async (roomInfo) => {
        setChatHistory([]);
        const response = await getChatHistory(roomInfo.id);
        setCurrentChatRoom(roomInfo.id);
        setChatHistory(convertData(response));
    }

    return (
        <Box
            display= {toggleSidePanel ? "flex" : "none"}
            flexDirection="column"
            justifyContent="space-between"
            p={2}
            sx={{ bgcolor: '#282d30', marginTop: "64px" }}
            maxHeight={{
                xs: "200px",
                md: "100%"
            }}
        >
            <Box flexGrow={1} sx={{ overflow: "auto" }}>
                <nav aria-label="secondary mailbox folders">
                    <List>
                        {chatRooms.map((item, index) => {
                            return (
                                <ListItem disablePadding key={index}>
                                    <ListItemButton onClick={() => handleOnClickRoom(item)}>
                                        <ListItemIcon sx={{ minWidth: "36px" }}>
                                            <ChatIcon sx={{ color: "#d4d5d5" }} />
                                        </ListItemIcon>
                                        <ListItemText primary={<Typography fontWeight="bold" color="#d4d5d5">{item.name}</Typography>} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                </nav>
            </Box>
            <Divider />
            <Box display="flex" flexDirection="column" gap={1}>
                <TextField
                    size="small"
                    inputRef={newChatRoomRef}
                    onChange={handleOnChange}
                    label="Set Chatroom Name.."
                    InputLabelProps={{ style: { color: '#939fa5' } }}
                    variant='outlined'
                    sx={{
                        input: {
                            color: "#bdbec2",
                        }
                    }}
                />
                <Button variant='contained'
                    sx={{
                        bgcolor: "#939fa5"
                    }}
                    onClick={handleSubmitNewChatRoom}
                >
                    <Typography fontSize={14} fontWeight="bold" color="#48545b">New Chat</Typography>
                </Button>
            </Box>
        </Box>
    )
}

export default GPTSidePanel;