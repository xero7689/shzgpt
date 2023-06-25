import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewChatRoom,
  currentChatRoomUpdated,
  fetchChatSession,
  fetchChatRoom,
  postNewMessage,
  selectAllChatRooms,
  selectCurrentChatRoomInfo,
  sessionHistoryPrevPush,
} from "../features/chatRoomSlice";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import {
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
  Menu,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useTheme } from "@mui/material/styles";

import { isMobile } from "react-device-detect";

const ChatRoomsManage = (props) => {
  const { toggle = false } = props;
  const theme = useTheme();

  const newChatRoomRef = useRef();
  const [newChatRoomNameInput, setNewChatRoomNameInput] = useState("");

  const chatRooms = useSelector(selectAllChatRooms);
  const currentChatRoomInfo = useSelector(selectCurrentChatRoomInfo);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleAddChatroomOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddChatroomClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {}, [chatRooms]);
  useEffect(() => {}, [currentChatRoomInfo]);

  const handleOnChange = (event) => {
    setNewChatRoomNameInput(event.target.value);
  };

  const handleSubmitNewChatRoom = async () => {
    const response = await dispatch(addNewChatRoom(newChatRoomNameInput));
    const chatRoomInfo = response.payload;
    dispatch(
      postNewMessage({
        chatRoomId: chatRoomInfo.id,
        role: "system",
        newMessage: "You're a helpful assistance.",
      })
    );
    dispatch(fetchChatRoom());
    dispatch(fetchChatSession(chatRoomInfo.id));
    dispatch(currentChatRoomUpdated(chatRoomInfo));
    setAnchorEl(null);
  };

  const handleOnClickRoom = async (roomInfo) => {
    dispatch(sessionHistoryPrevPush(currentChatRoomInfo));
    dispatch(fetchChatSession(roomInfo.id));

    const newChatRoomInfo = {
      id: roomInfo.id,
      name: roomInfo.name,
    };
    dispatch(currentChatRoomUpdated(newChatRoomInfo));
  };

  return (
    <Box
      position={{
        xs: "fixed",
        md: "static",
      }}
      display={toggle ? "flex" : "none"}
      flexDirection="column"
      justifyContent="space-between"
      px={2}
      pb={3}
      sx={{
        backgroundColor: "primary.main",
      }}
      minWidth="200px"
      maxHeight={ isMobile ? "90vh" : "100vh"}
      boxShadow={{
        xs: 5,
        md: 0,
      }}
      borderRadius={{
        xs: "12px",
        md: "0",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        pl={2}
        pt={{
          xs: 1,
          sm: 3,
        }}
        pb={{
          xs: 1,
          sm: 2,
        }}
      >
        <Typography
          color="primary.contrastText"
          fontSize="normal"
          fontWeight="bold"
        >
          CHATROOM
        </Typography>
        <IconButton sx={{ padding: 0 }} onClick={handleAddChatroomOpen}>
          <AddBoxIcon fontSize="small" sx={{ color: "primary.contrastText" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleAddChatroomClose}
          PaperProps={{
            sx: {
              marginTop: 4,
            }
          }}
        >
          <Box display="flex" flexDirection="column" gap={1} backgroundColor="background.pape2" padding={2}>
            <Typography color="primary.contrastText" textAlign="center" fontWeight="bold">Add New Chatroom</Typography>
            <TextField
              size="small"
              inputRef={newChatRoomRef}
              onChange={handleOnChange}
              InputLabelProps={{
                style: { color: theme.palette.primary.contrastText },
              }}
              variant="outlined"
              sx={{
                input: {
                  color: "primary.contrastText",
                },
                fieldset: {
                  borderColor: "primary.border",
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: "secondary.main",
              }}
              onClick={handleSubmitNewChatRoom}
            >
              <Typography
                fontSize={14}
                fontWeight="bold"
                color="secondary.contrastText"
              >
                Add!
              </Typography>
            </Button>
          </Box>
        </Menu>
      </Box>
      <Divider sx={{ my: 0 }} />
      <Box flexGrow={1} sx={{ overflow: "auto" }}>
        <nav aria-label="secondary mailbox folders">
          <List>
            {chatRooms.map((item, index) => {
              return (
                <ListItem disablePadding key={index}>
                  <ListItemButton onClick={() => handleOnClickRoom(item)}>
                    <ListItemText
                      primary={
                        <Typography
                          color="primary.contrastText"
                          fontSize="small"
                        >
                          {item.name}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </nav>
      </Box>
      <Divider sx={{ my: 2 }} variant="middle" />
    </Box>
  );
};

export default ChatRoomsManage;
