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
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import {
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ChatRoomsManage = (props) => {
  // const { toggleSidePanel, setToggleSidePanel } = props;
  const { toggle=false } = props;
  const theme = useTheme();

  const newChatRoomRef = useRef();
  const [newChatRoomNameInput, setNewChatRoomNameInput] = useState("");

  const chatRooms = useSelector(selectAllChatRooms);
  const currentChatRoomInfo = useSelector(selectCurrentChatRoomInfo);
  const dispatch = useDispatch();

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
      zIndex={9999}
      display={ toggle ? "flex" : "none"}
      flexDirection="column"
      justifyContent="space-between"
      px={2}
      pb={3}
      sx={{
        backgroundColor: "primary.main",
      }}
      minWidth="200px"
      maxHeight={{
        xs: "50%",
        md: "100%",
      }}
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
        gap={2}
        alignItems="center"
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
        {/* <IconButton
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
          }}
          onClick={() => setToggleSidePanel(false)}
        > */}
          {/* <CloseIcon fontSize="small" sx={{ color: "primary.contrastText" }} /> */}
        {/* </IconButton> */}
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
      <Box display="flex" flexDirection="column" gap={1}>
        <TextField
          size="small"
          inputRef={newChatRoomRef}
          onChange={handleOnChange}
          label="Set Chatroom Name.."
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
            New Chat
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default ChatRoomsManage;
