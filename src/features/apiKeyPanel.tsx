import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";

import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography,
} from "@mui/material";

import {
  fetchAPIKey,
  selectActiveKey,
  selectAllAPIKeys,
  updateActiveKey,
} from "./apiKeySlice";
import { selectUserIsLogin } from "./chatUserSlice";

export default function APIKeyPanel() {
  const dispatch = useDispatch() as AppDispatch;
  const APIKeys = useSelector(selectAllAPIKeys);
  const activeKey = useSelector(selectActiveKey);
  const userIsLogin = useSelector(selectUserIsLogin);
  const [inputAPIKey, setInputAPIKey] = useState<string | null>(null);

  const handleAPIKeyInputOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputAPIKey(event.target.value);
  };

  // const handleAddInputAPIKey = () => {
  //   dispatch(setApiKey(inputAPIKey));
  // };

  const handleKeyItemOnClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    dispatch(updateActiveKey(target.textContent));
  };

  useEffect(() => {
    console.log(`[API Key Panel][Effect] User Login Change to ${userIsLogin}`);
    if (userIsLogin) {
      dispatch(fetchAPIKey());
    }
  }, [dispatch, userIsLogin]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box>
        <Typography
          fontSize="large"
          color="primary.contrastText"
          marginBottom={1}
        >
          OpenAI API Configuration
        </Typography>
        {/* <Typography variant="p" fontSize="small" color="primary.contrastText">
          Register an API key for ChatGPT from OpenAI, and copy the key for use
          in here.
        </Typography> */}
      </Box>
      {/* <Box display="flex">
        <TextField
          onChange={handleAPIKeyInputOnChange}
          size="small"
          label="Your API Key"
          variant="outlined"
        />
        <Button onClick={handleAddInputAPIKey} variant="contained">
          Add
        </Button>
      </Box> */}
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" sx={{ gap: 2, color: "primary.contrastText" }}>
          <Typography fontSize="normal">Active API Key:</Typography>
          <Typography fontSize="normal" color="secondary.main">
            {activeKey}
          </Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="center">API Key</TableCell>
                <TableCell align="right">Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {APIKeys.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={handleKeyItemOnClick}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="right">{row.key}</TableCell>
                  <TableCell align="right">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
