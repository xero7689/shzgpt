import { Box, Typography } from "@mui/material";
import SettingsPanelItem from "../components/settingsPanelItem";
import { useDispatch, useSelector } from "react-redux";
import {
  selectMaxCompleteTokenLength,
  updateMaxCompleteTokenLength,
} from "./chatRoomSlice";

export default function ChatRoomSettingsPanel() {
  const dispatch = useDispatch();
  const maxCompleteTokenLength = useSelector(selectMaxCompleteTokenLength);
  const readMaximumCompeleteNum = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const parsedValue = parseInt(target.value);
    dispatch(updateMaxCompleteTokenLength(parsedValue));
  };
  return (
    <Box>
      <Box>
        <Typography
          fontSize="large"
          color="primary.contrastText"
          marginBottom={1}
        >
          OpenAI API Configuration
        </Typography>
      </Box>
      <SettingsPanelItem
        title="Maximun Complete Message Tokens"
        desc="This value is used to control the querying of the API and prevent
          token length limits from being reached."
        onInputChangeHandler={readMaximumCompeleteNum}
        defaultValue={maxCompleteTokenLength}
      ></SettingsPanelItem>
    </Box>
  );
}
