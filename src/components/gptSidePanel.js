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
import CloseIcon from '@mui/icons-material/Close';

import { getChatRoom, getChatHistory, createChatRoom, postChat } from '../fetchers/storage';

const GPTSidePanel = (props) => {
    const { setChatHistory, setCurrentChatRoom, toggleSidePanel, setToggleSidePanel } = props;
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
        await postChat(response.id, "system", "You're a helpful assistance.");
        setChatHistory([]);
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
            position={{
                xs: "fixed",
                md: "static"
            }}
            zIndex={9999}
            display={toggleSidePanel ? "flex" : "none"}
            flexDirection="column"
            justifyContent="space-between"
            px={2}
            pb={3}
            sx={{
                backgroundColor: "primary.main",
                borderRight: "1px solid",
                borderColor: "primary.border"
            }}
            maxHeight={{
                xs: "50%",
                md: "100%"
            }}
            boxShadow={{
                xs: 5,
                md: 0
            }}
            borderRadius={{
                xs: "12px",
                md: "0"
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center"
                pt={{
                    xs: 1,
                    sm: 3
                }} pb={{
                    xs: 1,
                    sm: 3
                }}
            >
                <Typography color="primary.contrastText" fontSize="normal" fontWeight="bold">
                    CHATROOM
                </Typography>
                <IconButton sx={{
                    display: {
                        xs: "block",
                        sm: "none"
                    }
                }} onClick={() => setToggleSidePanel(false)}>
                    <CloseIcon fontSize="small" sx={{ color: "primary.contrastText" }} />
                </IconButton>
            </Box>
            <Divider sx={{ my: 0 }} />
            <Box flexGrow={1} sx={{ overflow: "auto" }}>
                <nav aria-label="secondary mailbox folders">
                    <List>
                        {chatRooms.map((item, index) => {
                            return (
                                <ListItem disablePadding key={index}>
                                    <ListItemButton onClick={() => handleOnClickRoom(item)}>
                                        <ListItemIcon sx={{ minWidth: "36px" }}>
                                            <ChatIcon sx={{ color: "primary.contrastText" }} color="secondary" fontSize='small' />
                                        </ListItemIcon>
                                        <ListItemText primary={<Typography color="primary.contrastText" fontSize="small">{item.name}</Typography>} />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>
                </nav>
            </Box>
            <Divider sx={{ my: 2 }} variant='middle' />
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
                    <Typography fontSize={14} fontWeight="bold" color="secondary.contrastText">New Chat</Typography>
                </Button>
            </Box>
        </Box>
    )
}

export default GPTSidePanel;