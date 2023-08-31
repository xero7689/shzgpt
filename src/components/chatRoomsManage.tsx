import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewChatRoom,
  currentChatRoomUpdated,
  fetchChatRoom,
  selectAllChatRooms,
  selectCurrentChatRoomId,
  sessionHistoryPrevPush,
  initChatRoomSession,
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
import { AppDispatch } from "../app/store";
import { ChatRoomObject } from "../types/interfaces";

import { postChat } from "../fetchers/storage";

import { ChatCompletionRequestMessageRoleEnum } from "openai";

import { formatShzGPTMessage } from "../formatter/MessageFormatter";

type ChatRoomManageProps = {
  toggle: boolean;
};

const ChatRoomsManage = (props: ChatRoomManageProps) => {
  const { toggle = false } = props;
  const theme = useTheme();

  const newChatRoomRef = useRef();
  const [newChatRoomNameInput, setNewChatRoomNameInput] = useState("");

  const chatRooms = useSelector(selectAllChatRooms);
  const currentChatRoomId = useSelector(selectCurrentChatRoomId);
  const dispatch = useDispatch() as AppDispatch;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleAddChatroomOpen = (event: React.MouseEvent<HTMLElement>) => {
    const currentTarget = event.currentTarget;
    setAnchorEl(currentTarget);
  };

  const handleAddChatroomClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {}, [chatRooms]);
  useEffect(() => {}, [currentChatRoomId]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatRoomNameInput(event.target.value);
  };

  const handleSubmitNewChatRoom = async () => {
    const response = await dispatch(addNewChatRoom(newChatRoomNameInput));
    const newChatRoomInfo = response.payload;

    const initMessage = {
      chatRoomId: newChatRoomInfo.id,
      role: ChatCompletionRequestMessageRoleEnum.System,
      newMessage: "You're a helpful assistance.",
    };
    await postChat(initMessage);

    // Init ChatRoom Sessions Here.
    const payload = {chatRoomId: newChatRoomInfo.id, initMessage: formatShzGPTMessage("You're a helpful assistance", ChatCompletionRequestMessageRoleEnum.System, newChatRoomInfo.id)}
    dispatch(initChatRoomSession(payload));

    dispatch(fetchChatRoom());
    dispatch(currentChatRoomUpdated(newChatRoomInfo.id));
    setAnchorEl(null);
  };

  const handleOnClickRoom = async (roomInfo: ChatRoomObject) => {
    dispatch(sessionHistoryPrevPush(currentChatRoomId));
    dispatch(currentChatRoomUpdated(roomInfo.id));
  };

  return (
    <Box
      display={toggle ? "flex" : "none"}
      flexDirection="column"
      px={2}
      pb={3}
      minWidth="200px"
      maxHeight={isMobile ? "90vh" : "100vh"}
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
            },
          }}
        >
          <Box display="flex" flexDirection="column" gap={1} padding={2}>
            <Typography
              color="primary.contrastText"
              textAlign="center"
              fontWeight="bold"
            >
              Add New Chatroom
            </Typography>
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
            {Object.keys(chatRooms).map((chatRoomIdStr: string, index) => {
              const chatRoomId = parseInt(chatRoomIdStr, 10);
              const chatRoom = chatRooms[chatRoomId];
              return (
                <ListItem disablePadding key={index}>
                  <ListItemButton onClick={() => handleOnClickRoom(chatRoom)}>
                    <ListItemText
                      primary={
                        <Typography
                          color="primary.contrastText"
                          fontSize="small"
                        >
                          {chatRoom.name}
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
