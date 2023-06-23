import { Box, TextField, Typography } from "@mui/material";

const panelItemStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  borderLeft: "1px solid",
  borderColor: "secondary.main",
  paddingLeft: 1.5,
  color: "primary.contrastText",
};

export default function SettingsPanelItem(props) {
  const { title, desc, onInputChangeHandler } = props;
  const handleOnInputChange = (event) => {
    onInputChangeHandler(event);
  };
  return (
    <Box sx={panelItemStyle}>
      <Typography fontWeight="bold">{title}</Typography>
      <Typography>{desc}</Typography>
      <TextField
        onChange={handleOnInputChange}
        size="small"
        type="number"
        sx={{
          width: "8ch",
        }}
      ></TextField>
    </Box>
  );
}
