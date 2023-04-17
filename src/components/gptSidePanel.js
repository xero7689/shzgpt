import { useState, useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { TextField, Button, Typography, Divider, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { getChatRoom, getChatHistory, createChatRoom, postChat } from '../fetchers/storage';

const GPTSidePanel = (props) => {
    const { setChatHistory, setCurrentChatRoom, toggleSidePanel } = props;
    const theme = useTheme();

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
        setCurrentChatRoom({
            id: response.id,
            name: response.name
        });

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
        setCurrentChatRoom({
            id: roomInfo.id,
            name: roomInfo.name
        });
        setChatHistory(convertData(response));
    }

    return (
        <Box
            display={toggleSidePanel ? "flex" : "none"}
            flexDirection="column"
            justifyContent="space-between"
            px={2}
            pb={3}
            sx={{ backgroundColor: "background.paper", marginTop: "64px", borderRight: "1px solid", borderColor: "primary.border" }}
            maxHeight={{
                xs: "200px",
                md: "100%"
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography color="primary.contrastText" fontSize="small" fontWeight="bold">
                    CHATROOM
                </Typography>
                <IconButton>
                    <MoreHorizIcon sx={{ color: "primary.contrastText" }} />
                </IconButton>
            </Box>
            <Box flexGrow={1} sx={{ overflow: "auto" }}>

                <nav aria-label="secondary mailbox folders">
                    <List>
                        {chatRooms.map((item, index) => {
                            return (
                                <ListItem disablePadding key={index}>
                                    <ListItemButton onClick={() => handleOnClickRoom(item)}>
                                        <ListItemIcon sx={{ minWidth: "36px" }}>
                                            <ChatIcon sx={{ color: "primary.contrastText" }} color="secondary" />
                                        </ListItemIcon>
                                        <ListItemText primary={<Typography color="primary.contrastText">{item.name}</Typography>} />
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
                    InputLabelProps={{ style: { color: theme.palette.primary.contrastText } }}
                    variant='outlined'
                    sx={{
                        input: {
                            color: "primary.contrastText",
                        },
                        fieldset: {
                            borderColor: "primary.border"
                        }
                    }}
                />
                <Button variant='contained'
                    sx={{
                        bgcolor: "secondary.main"
                    }}
                    onClick={handleSubmitNewChatRoom}
                >
                    <Typography fontSize={14} fontWeight="bold" color="#primary.contrastText">New Chat</Typography>
                </Button>
            </Box>
        </Box>
    )
}

export default GPTSidePanel;