import { useSelector } from "react-redux";

import {
  selectCurrentChatRoomId,
  selectCurrentChatSession,
  selectChatRoomSessionsById,
  selectFetchGPTStatus,
} from "./chatRoomSlice";

import { Box, Container } from "@mui/material";

import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { useEffect, useRef, useState } from "react";

import { isMobile } from "react-device-detect";

import { RootState } from "../app/store";

const AlwaysScrollToBottom = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const chatSession = useSelector(selectCurrentChatSession);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatSession]);
  return <div ref={elementRef} />;
};

interface ChatSessionArgs {
  colorMode: string;
  chatContentRef: React.MutableRefObject<HTMLElement | null>;
}

export const ChatSession = (props: ChatSessionArgs) => {
  const { colorMode } = props;
  const [queryInProgress, setQueryInProgress] = useState(false);

  const currentChatRoomId = useSelector(selectCurrentChatRoomId);
  const chatSessions = useSelector(state => selectChatRoomSessionsById(state as RootState, currentChatRoomId));

  const queryStatus = useSelector(selectFetchGPTStatus);

  const tmpContentRef = useRef(null);

  useEffect(() => {
    if (queryStatus === "loading") {
      setQueryInProgress(true);
    } else {
      setQueryInProgress(false);
    }
  }, [queryStatus]);

  return (
    <Box flexGrow={1} sx={{ overflow: "auto" }}>
      <Container maxWidth={isMobile ? "sm" : "md"}>
        <Box
          ref={tmpContentRef}
          className="ChatContent"
          display="flex"
          flexDirection="column"
          gap={4}
          pt={3}
          sx={{
            overflow: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {chatSessions && (chatSessions.map((item) => {
            return (
              <MessageBox
                key={item.timestamp}
                timestamp={item.timestamp}
                role={item.role}
                content={item.content}
                colorMode={colorMode}
              ></MessageBox>
            );
          }))}
          <LoadingBox queryInProgress={queryInProgress} />
          <AlwaysScrollToBottom></AlwaysScrollToBottom>
        </Box>
      </Container>
    </Box>
  );
};
