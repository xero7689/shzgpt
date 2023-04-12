import { Box, Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';


export default function InputForm(props) {
    const { setNeedScroll, handleInputChange, handleSendMessage, messageRef } = props;
    
    function handleSubmit(event) {
        event.preventDefault();
        // handle form submission here
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSendMessage()
            setNeedScroll(prev=>!prev)
        };
    }
    return (
        <Box
            className="InputGroup"
            component="form"
            autoComplete="off"
            display="flex"
            onSubmit={handleSubmit}
            py={2}
            gap={2}
        >
            <TextField
                inputRef={messageRef}
                id="outlined-basic"
                variant="filled"
                onChange={ handleInputChange }
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                label="Send a message..."
                multiline
                maxRows={1}
                InputLabelProps={{ style: { color: '#e9e9fd' } }}
                sx={{
                    width: "100%",
                    backgroundColor: "#282930",
                    textArea: {
                        color: "#bdbec2",
                    }
                }}
            />
            <Button variant="contained" endIcon={<SendIcon />}
                sx={{
                    fontWeight: "bold",
                    backgroundColor: "#5b61ed",
                    color: "#e9e9fd"
                }}
                onClick={handleSendMessage}
            >
                Send
            </Button>
        </Box>
    )

}