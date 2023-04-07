import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { CopyBlock } from 'react-code-blocks';
import '../App.css';

function parseContent(content) {
    const regex = /`{3}([^`]+)`{3}/g;
    const parts = content.split(regex);

    return (
        <Box>
            { parts.map((message, index) => {
                return (
                    <Typography key={index}>
                        {message}
                    </Typography>
                )
            }) }
        </Box>
    )

}

export default function MessageBox(props) {
    const { timestamp, role, content } = props;

    const isUser = role === "user";
    const isSystem  = role === "system";
    const timeString = new Date(timestamp);

    return (
        <Box display={ isSystem ? "none" : "flex"} justifyContent={isUser ? "flex-end" : "flex-start"} gap={1}>
            <Box display="flex" maxWidth="65%"
                sx={{
                    borderRadius: "12px",
                    border: isUser ? "0.5px solid #6fa49c" : "0.5px solid #616266",
                    backgroundColor: isUser ? "#1f242d" : "#282930",
                    whiteSpace: 'pre-line',
                    order: isUser ? 2 : 1,
                }}
                textAlign="left"
                p={2}
            >
                <Typography sx={{ color: isUser ? "#6fa49c" : "#bdbec2", lineHeight: '1.5'}} variant='body' color="#f3f3f3">{content}</Typography>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="flex-end"
                sx={{
                    order: isUser ? 1 : 2
                }}
            >
                <Typography sx={{ color: "grey"}} fontSize="14px" fontWeight="light" fontStyle='oblique'>{timeString.toLocaleTimeString()}</Typography>
            </Box>
        </Box>
    )
}