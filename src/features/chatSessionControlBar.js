import { useSelector } from "react-redux";
import { selectCurrentChatRoomInfo } from "./chatRoomSlice";

import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export const ChatSessionControlBar = (props) => {
  const currentChatRoomInfo = useSelector(selectCurrentChatRoomInfo);
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="primary.main"
      px={2}
    >
      <Box display="flex">
        <IconButton>
          <ArrowBackIcon
            fontSize="small"
            sx={{ color: "primary.contrastText" }}
          ></ArrowBackIcon>
        </IconButton>
        <IconButton>
          <ArrowForwardIcon
            fontSize="small"
            sx={{ color: "primary.contrastText" }}
          ></ArrowForwardIcon>
        </IconButton>
      </Box>
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        pl={2}
        color="primary.contrastText"
      >
        {currentChatRoomInfo.name}
      </Typography>
      <IconButton>
        <MoreVertIcon sx={{ color: "primary.contrastText" }} />
      </IconButton>
    </Box>
  );
};
