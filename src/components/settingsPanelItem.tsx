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

type SettingsPanelItemProps = {
  title: string;
  desc: string;
  onInputChangeHandler: React.ChangeEventHandler<HTMLInputElement>;
  defaultValue: number;
};

export default function SettingsPanelItem(props: SettingsPanelItemProps) {
  const { title, desc, onInputChangeHandler, defaultValue } = props;
  const handleOnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        defaultValue={defaultValue}
      ></TextField>
    </Box>
  );
}
