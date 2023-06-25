import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatSession,
  selectCurrentChatRoomInfo,
  selectSessionHistoryNext,
  selectSessionHistoryPrev,
  sessionHistoryNextPop,
  sessionHistoryNextPush,
  sessionHistoryPrevPop,
  sessionHistoryPrevPush,
} from "./chatRoomSlice";

import { Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect } from "react";

export const ChatSessionControlBar = (props) => {
  const dispatch = useDispatch();
  const currentChatRoomInfo = useSelector(selectCurrentChatRoomInfo);
  const sessionHistoryPrev = useSelector(selectSessionHistoryPrev);
  const sessionHistoryNext = useSelector(selectSessionHistoryNext);

  const handlePreviousSessionClick = () => {
    if (sessionHistoryPrev.length !== 0) {
      dispatch(sessionHistoryPrevPop());
      dispatch(sessionHistoryNextPush(currentChatRoomInfo));
    }
  };

  const handleNextSessionClick = () => {
    if (sessionHistoryNext.length !== 0) {
      dispatch(sessionHistoryPrevPush(currentChatRoomInfo));
      dispatch(sessionHistoryNextPop());
    }
  };

  useEffect(() => {
    if (currentChatRoomInfo.id !== null) {
      dispatch(fetchChatSession(currentChatRoomInfo.id));
    }
  }, [dispatch, currentChatRoomInfo]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="primary.main"
      px={2}
    >
      <IconButton onClick={handlePreviousSessionClick}>
        <ArrowBackIcon
          fontSize="small"
          sx={{ color: "primary.contrastText" }}
        ></ArrowBackIcon>
      </IconButton>
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        pl={2}
        color="primary.contrastText"
      >
        {currentChatRoomInfo.name}
      </Typography>
      <IconButton onClick={handleNextSessionClick}>
        <ArrowForwardIcon
          fontSize="small"
          sx={{ color: "primary.contrastText" }}
        ></ArrowForwardIcon>
      </IconButton>
    </Box>
  );
};
