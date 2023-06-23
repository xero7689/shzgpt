import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Modal, Tab, Tabs } from "@mui/material";

import {
  selectSettingsDisplayState,
  toggleSettingsModal,
} from "./settingsSlice";
import APIKeyPanel from "./apiKeyPanel";
import ChatRoomSettingsPanel from "./chatRoomSettingsPanel";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: "50%",
  bgcolor: "background.paper2",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexGrow: 1,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box display="flex" flexDirection="column" paddingLeft={2} gap={2}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function SettingsModal(props) {
  const dispatch = useDispatch();
  const settingsIsDisplay = useSelector(selectSettingsDisplayState);

  const [value, setValue] = useState(0);

  const handleModalChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSettingsClose = () => {
    dispatch(toggleSettingsModal());
  };

  return (
    <Modal
      open={settingsIsDisplay}
      onClose={handleSettingsClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleModalChange}
          aria-label="Settings"
          textColor="secondary"
          TabIndicatorProps={{
            style: {
              backgroundColor: "secondary.main",
            },
          }}
          sx={{
            borderRight: 1,
            borderColor: "divider",
          }}
        >
          <Tab label="OpenAI" {...a11yProps(0)} />
          <Tab label="Chat Room" {...a11yProps(1)} />
        </Tabs>

        <TabPanel value={value} index={0}>
          <APIKeyPanel></APIKeyPanel>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <ChatRoomSettingsPanel></ChatRoomSettingsPanel>
        </TabPanel>
      </Box>
    </Modal>
  );
}
