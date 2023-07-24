import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAllPrompts, fetchPrompts } from "./promptsSlice";
import { fetchPromptTopic } from "./promptTopicSlice";
import {
  Box,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
} from "@mui/material";

import { RootState, AppDispatch } from "../app/store";
import { ShzGPTPrompt } from "../types/interfaces";

interface PromptItemArgs {
  key: number;
  prompt: ShzGPTPrompt;
}

const PromptItem = (props: PromptItemArgs) => {
  const [showContent, setShowContent] = useState(false);
  const { prompt } = props;

  const handleMouseEnter = () => {
    setShowContent(true);
  };

  const handleMouseLeave = () => {
    setShowContent(false);
  };

  const handleMouseClick = async () => {
    return await navigator.clipboard.writeText(prompt.content);
  };

  return (
    <ListItem
      key="index"
      color="primary.contrastText"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseClick}
      disablePadding
    >
      <ListItemButton>
        <Typography fontSize="small" color="primary.contrastText">
          {prompt.name}
        </Typography>
        {showContent && (
          <Box
            sx={{
              position: "absolute",
              top: "100%",
              transform: "translateX(-50%)",
              backgroundColor: "primary.main",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: "primary.border",
              padding: "16px",
            }}
            maxWidth="571px"
            zIndex="9998"
          >
            <Typography color="primary.contrastText">
              {prompt.content}
            </Typography>
          </Box>
        )}
      </ListItemButton>
    </ListItem>
  );
};

export const PromptsList = () => {
  const dispatch = useDispatch() as AppDispatch;
  const prompts = useSelector(selectAllPrompts) as ShzGPTPrompt[];
  const fetchError = useSelector((state: RootState) => state.prompts.error);

  const fetchPromptStatus = useSelector(
    (state: RootState) => state.prompts.status
  );
  const fetchPromptTopicStatus = useSelector(
    (state: RootState) => state.promptTopic.status
  );

  useEffect(() => {
    if (fetchPromptStatus === "idle") {
      dispatch(fetchPrompts());
    }
  }, [fetchPromptStatus, dispatch]);

  useEffect(() => {
    if (fetchPromptTopicStatus === "idle") {
      dispatch(fetchPromptTopic());
    }
  }, [fetchPromptTopicStatus, dispatch]);

  let renderedPrompts;

  if (fetchPromptStatus === "loading") {
    renderedPrompts = <CircularProgress />;
  } else if (fetchPromptStatus === "succeeded") {
    renderedPrompts = prompts.map((prompt, index) => {
      return <PromptItem key={index} prompt={prompt} />;
    });
  } else if (fetchPromptStatus === "failed") {
    renderedPrompts = <Box>{fetchError}</Box>;
  }

  return (
    <Box flexDirection="column" flexGrow={1} px={2} pb={3}>
      <Box
        pl={2}
        gap={2}
        alignItems="center"
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
          PROMPTS
        </Typography>
      </Box>
      <Divider sx={{ my: 0 }}></Divider>
      <Box component="nav">
        <List>{renderedPrompts}</List>
      </Box>
    </Box>
  );
};
