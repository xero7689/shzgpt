import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import { Box, List, ListItem, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { removeFixedPromptFromCurrentChatRoom } from "./chatRoomSlice";
import { selectAllFixedPromptsFromCurrnetChatRoom } from "./chatRoomSlice";
import { selectPromptById } from "./promptsSlice";
import { RootState } from "../app/store";
import { useTheme } from "@mui/material";

interface FixedPromptItemArgs {
  key: number;
  promptId: number;
}

const FixedPromptItem = (props: FixedPromptItemArgs) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { key, promptId } = props;
  const prompt = useSelector((state) =>
    selectPromptById(state as RootState, promptId)
  );
  const handleRemoveFixedPrompt = () => {
    dispatch(removeFixedPromptFromCurrentChatRoom(promptId));
  };
  return (
    <ListItem sx={{ paddingY: "0" }}>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "primary.border",
          borderRadius: "4px",
          padding: "8px",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography color="primary.contrastText">
          {prompt && prompt.content}
        </Typography>
      </Box>
      <IconButton onClick={handleRemoveFixedPrompt}>
        <PlaylistRemoveIcon></PlaylistRemoveIcon>
      </IconButton>
    </ListItem>
  );
};

export default function FixedPromptsList() {
  const fixedPrompts = useSelector(selectAllFixedPromptsFromCurrnetChatRoom);
  let renderedFixedPrompts;
  renderedFixedPrompts = fixedPrompts.map((promptId, index) => {
    return <FixedPromptItem key={index} promptId={promptId}></FixedPromptItem>;
  });
  return (
    <Box>
      <List>{renderedFixedPrompts}</List>
    </Box>
  );
}
