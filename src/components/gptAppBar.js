import { useState, forwardRef, useEffect } from "react";

import { styled, alpha } from "@mui/material/styles";
import { Divider, List, ListItemButton, ListItemText } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";

import { useDispatch, useSelector } from "react-redux";
import { toggleSettingsModal } from "../features/settingsSlice";
import { toggleChatUserModal } from "../features/chatUserSlice";
import {
  fetchChatSession,
  selectAllChatRooms,
  selectCurrentChatRoomInfo,
  sessionHistoryPrevPush,
  currentChatRoomUpdated,
} from "../features/chatRoomSlice";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

function GPTAppBar(props, ref) {
  const { setToggleSidePanel, setColorMode } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const allChatRooms = useSelector(selectAllChatRooms);

  // Search Bar state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [chatroomSearchResult, setChatroomSearchResult] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const currentChatRoomInfo = useSelector(selectCurrentChatRoomInfo);

  const handleClick = () => {
    setToggleSidePanel((toggle) => !toggle);
  };

  const handleSwitchColorMode = () => {
    setColorMode((preMode) => (preMode === "light" ? "dark" : "light"));
  };

  const handleSettingsClick = () => {
    dispatch(toggleSettingsModal());
  };

  const handleChatUserClick = () => {
    dispatch(toggleChatUserModal());
  };

  const handleSearchBarFocus = () => {
    if (searchKeyword) {
      setIsSearching(true);
    }
  };

  const handleSearchBarBlur = () => {
    setIsSearching(false);
  };

  const searchChatRooms = (chatrooms, keyword) => {
    const filteredChatRooms = chatrooms.filter((chatroom) => {
      const name = chatroom.name.toLowerCase();
      const searchKeyword = keyword.toLowerCase();
      return name.includes(searchKeyword);
    });
    return filteredChatRooms;
  };

  const handleSearchBarChange = (event) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);
    const matchRooms = searchChatRooms(allChatRooms, keyword);
    setChatroomSearchResult(matchRooms);
    if (!isSearching && searchKeyword) {
      setIsSearching(true);
    }
  };

  useEffect(() => {
    if (isSearching) {
      if (!searchKeyword) {
        setIsSearching(false);
      }
    }
  }, [isSearching, searchKeyword]);

  const handleListItemClick = (event, chatRoomInfo) => {
    dispatch(sessionHistoryPrevPush(currentChatRoomInfo));
    dispatch(fetchChatSession(chatRoomInfo.id));
    const newChatRoomInfo = {
      id: chatRoomInfo.id,
      name: chatRoomInfo.name,
    };
    dispatch(currentChatRoomUpdated(newChatRoomInfo));
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: theme.palette.primary.border,
      }}
      ref={ref}
    >
      <Toolbar>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" alignItems="center">
            <IconButton
              sx={{
                color: "primary.contrastText",
              }}
              onClick={handleClick}
            >
              <MenuIcon fontSize="small" />
            </IconButton>

            <Typography
              display={{
                xs: "none",
                sm: "block",
              }}
              color="primary.contrastText"
              fontSize="normal"
              noWrap
              component="div"
              fontWeight="bold"
              ml={2}
            >
              SHZ GPT
            </Typography>
          </Box>
          <Box>
            <Search>
              <TextField
                size="small"
                onFocus={handleSearchBarFocus}
                onBlur={handleSearchBarBlur}
                onChange={handleSearchBarChange}
                InputLabelProps={{
                  style: {
                    color: "#939fa5",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "primary.contrastText" }} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                sx={{
                  input: {
                    color: "#bdbec2",
                  },
                  fieldset: {
                    borderColor: "primary.border",
                  },
                }}
              >
                Search
              </TextField>
            </Search>
            <List
              component="nav"
              aria-label="main mailbox folders"
              sx={{
                display: isSearching ? "block" : "none",
                position: "absolute",
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "primary.border",
                paddingLeft: 1,
                paddingRight: 1,
              }}
            >
              <ListItemText>
                <Typography fontSize="small" color="secondary.main">
                  Chatroom Results
                </Typography>
              </ListItemText>
              <Divider></Divider>
              {chatroomSearchResult.map((item, index) => {
                return (
                  <ListItemButton
                    key={index}
                    selected={selectedIndex === index}
                    onMouseDown={(event) => {
                      handleListItemClick(event, item);
                    }}
                    sx={{
                      padding: 0,
                    }}
                  >
                    <ListItemText
                      sx={{ color: "primary.contrastText" }}
                    >
                      <Typography color="primary.contrastText" fontSize="small">{item.name}</Typography>
                    </ListItemText>
                  </ListItemButton>
                );
              })}
              <Divider></Divider>
            </List>
          </Box>
          <Box sx={{ display: { xs: "flex" } }}>
            <IconButton
              sx={{ color: "primary.contrastText" }}
              onClick={handleSwitchColorMode}
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon fontSize="small" />
              ) : (
                <Brightness4Icon fontSize="small" />
              )}
            </IconButton>
            <IconButton
              onClick={handleSettingsClick}
              aria-label="show more"
              aria-haspopup="true"
              sx={{
                color: "primary.contrastText",
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleChatUserClick}
              sx={{
                color: "primary.contrastText",
              }}
            >
              <AccountCircleIcon fontSize="small"></AccountCircleIcon>
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default forwardRef(GPTAppBar);
