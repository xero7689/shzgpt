import { useSelector } from "react-redux";

import { selectAllChatHistory, selectFetchGPTStatus } from "./chatRoomSlice";

import { Box, Container } from "@mui/material";

import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { useEffect, useRef, useState } from "react";

const AlwaysScrollToBottom = () => {
  const elementRef = useRef(null);
  const chatHistory = useSelector(selectAllChatHistory);

  useEffect(() => {
    elementRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);
  return <div ref={elementRef} />;
};

export const ChatHistoryList = (props) => {
  const { colorMode } = props;
  const [queryInProgress, setQueryInProgress] = useState(false);

  const chatHistory = useSelector(selectAllChatHistory);
  const queryStatus = useSelector(selectFetchGPTStatus)

  const tmpContentRef = useRef(null);

  useEffect(() => {
    if (queryStatus === "loading") {
      setQueryInProgress(true);
    } else {
      setQueryInProgress(false)
    } 
  }, [queryStatus])

  return (
    <Box flexGrow={1} sx={{ overflow: "auto" }}>
      <Container maxWidth="md">
        <Box
          ref={tmpContentRef}
          className="ChatContent"
          px={4}
          display="flex"
          flexDirection="column"
          gap={4}
          pt={4}
          py={3}
          sx={{
            // overflow: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {chatHistory.map((item) => {
            return (
              <MessageBox
                key={item.timestamp}
                timestamp={item.timestamp}
                role={item.role}
                content={item.content}
                colorMode={colorMode}
              ></MessageBox>
            );
          })}
          <LoadingBox queryInProgress={queryInProgress} />
          <AlwaysScrollToBottom></AlwaysScrollToBottom>
        </Box>
      </Container>
    </Box>
  );
};
