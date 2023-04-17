import { Box, Button, TextField } from '@mui/material';
import { useTheme } from '@emotion/react';
import SendIcon from '@mui/icons-material/Send';


export default function InputForm(props) {
    const { setNeedScroll, handleInputChange, handleSendMessage, messageRef } = props;
    const theme = useTheme();

    function handleSubmit(event) {
        event.preventDefault();
        // handle form submission here
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (event.shiftKey) {
                // Do line break here!
            } else {
                event.preventDefault();
                if (messageRef.current.value.trim() === '') {
                    return;
                } 
                handleSendMessage()
                setNeedScroll(prev => !prev)
            }
        };
    }
    return (
        <Box

            className="InputGroup"
            component="form"
            autoComplete="off"
            display="flex"
            alignItems="center"
            onSubmit={handleSubmit}
            p={2}
            gap={2}
        >
            <TextField
                inputRef={messageRef}
                id="outlined-basic"
                variant="filled"
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                label="Send a message..."
                multiline
                maxRows={4}
                InputLabelProps={{ style: { color: theme.palette.primary.contrastText } }}
                sx={{
                    width: "100%",
                    backgroundColor: theme.palette.primary.main,
                    textArea: {
                        color: theme.palette.primary.contrastText,
                    }
                }}
            />
            <Button variant="contained" endIcon={<SendIcon />}
                sx={{
                    fontWeight: "bold",
                    backgroundColor: theme.palette.thirdary.main,
                    color: theme.palette.primary.contrastText
                }}
                onClick={handleSendMessage}
            >
                Send
            </Button>
        </Box>
    )

}