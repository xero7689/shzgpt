import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  currentChatRoomUpdated,
  fetchChatHistory,
  fetchChatRoom,
  selectAllChatRooms,
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
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

import { createChatRoom, postChat } from "../fetchers/storage";

const GPTSidePanel = (props) => {
  const { toggleSidePanel, setToggleSidePanel } = props;
  const theme = useTheme();

  const newChatRoomRef = useRef();
  // const [chatRooms, setChatRooms] = useState([]);
  const [newChatRoomName, setNewChatRoomName] = useState("");
  const [newChatRoomNameInput, setNewChatRoomNameInput] = useState("");

  const chatRooms = useSelector(selectAllChatRooms);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchChatRoom());
  }, [dispatch]);

  useEffect(() => {}, [chatRooms]);

  const handleOnChange = (event) => {
    setNewChatRoomNameInput(event.target.value);
  };

  const handleSubmitNewChatRoom = async () => {
    const response = await createChatRoom(newChatRoomNameInput);
    // setChatRooms(preChatroom => [...preChatroom, response]);
    setNewChatRoomName(response.name);
    await postChat(response.id, "system", "You're a helpful assistance.");
  };

  const handleOnClickRoom = async (roomInfo) => {
    dispatch(fetchChatHistory(roomInfo.id));

    const currentChatRoomInfo = {
      id: roomInfo.id,
      name: roomInfo.name,
    };
    dispatch(currentChatRoomUpdated(currentChatRoomInfo));
  };

  return (
    <Box
      position={{
        xs: "fixed",
        md: "static",
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
        borderColor: "primary.border",
      }}
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
        justifyContent="space-between"
        alignItems="center"
        pt={{
          xs: 1,
          sm: 3,
        }}
        pb={{
          xs: 1,
          sm: 3,
        }}
      >
        <Typography
          color="primary.contrastText"
          fontSize="normal"
          fontWeight="bold"
        >
          CHATROOM
        </Typography>
        <IconButton
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
          }}
          onClick={() => setToggleSidePanel(false)}
        >
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
                      <ChatIcon
                        sx={{ color: "primary.contrastText" }}
                        color="secondary"
                        fontSize="small"
                      />
                    </ListItemIcon>
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

export default GPTSidePanel;
