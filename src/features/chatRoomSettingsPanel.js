import { Box, TextField, Typography } from "@mui/material";
import SettingsPanelItem from "../components/settingsPanelItem";

export default function ChatRoomSettingsPanel(props) {
  const readMaximumCompeleteNum = (event) => {
    console.log(event.target.value);
  }
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
        title="Maximun Complete Message Number"
        desc="This value is used to control the querying of the API and prevent
          token length limits from being reached."
        onInputChangeHandler={readMaximumCompeleteNum}
      ></SettingsPanelItem>
    </Box>
  );
}
