import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatSession,
  selectCurrentChatRoomId,
  selectChatRoomById,
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
import { useEffect } from "react";
import { AppDispatch, RootState } from "../app/store";

export const ChatSessionControlBar = () => {
  const dispatch = useDispatch() as AppDispatch;
  const currentChatRoomId = useSelector(selectCurrentChatRoomId);
  const currentChatRoom = useSelector(state => selectChatRoomById(state as RootState, currentChatRoomId));
  const sessionHistoryPrev = useSelector(selectSessionHistoryPrev);
  const sessionHistoryNext = useSelector(selectSessionHistoryNext);

  const handlePreviousSessionClick = () => {
    if (sessionHistoryPrev.length !== 0) {
      dispatch(sessionHistoryPrevPop());
      dispatch(sessionHistoryNextPush(currentChatRoomId));
    }
  };

  const handleNextSessionClick = () => {
    if (sessionHistoryNext.length !== 0) {
      dispatch(sessionHistoryPrevPush(currentChatRoomId));
      dispatch(sessionHistoryNextPop());
    }
  };

  useEffect(() => {
    if (currentChatRoomId) {
      dispatch(fetchChatSession({roomId: currentChatRoomId}));
    }
  }, [dispatch, currentChatRoomId]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
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
        {currentChatRoomId && currentChatRoom ? `${currentChatRoom.name}` : "[Anonymouse ChatRoom]"}
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
