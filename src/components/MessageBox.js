import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import CodeBlock from "./CodeBlock";

function separateCodeBlocks(rawString) {
    const pattern = /```([^\n]+)\n([\s\S]+?)\n```/g;
    let match, lastIndex = 0;
    const blocks = [];
    while ((match = pattern.exec(rawString))) {
        const [fullMatch, language, code] = match;
        if (match.index > lastIndex) {
            const plainString = rawString.substring(lastIndex, match.index);
            blocks.push({ type: 'plain', content: plainString });
        }
        blocks.push({ type: 'code', content: code, language });
        lastIndex = pattern.lastIndex;
    }
    if (lastIndex < rawString.length) {
        const plainString = rawString.substring(lastIndex);
        blocks.push({ type: 'plain', content: plainString });
    }
    return blocks;
}

function ParseContent(props) {
    const { isUser, content } = props;
    const blocks = separateCodeBlocks(content);
    return (
        <Box display="flex" flexDirection="column">
            {blocks.map((block, index) => {
                if (block.type === "code") {
                    return (
                        <Box key={index}>
                            <CodeBlock codeString={block.content} language={block.language}></CodeBlock>
                        </Box>
                    )
                }
                return (
                    <Box
                        key={index}
                    >
                        <Typography>
                            { isUser ? block.content.trim() : block.content}
                        </Typography>
                    </Box>
                )
            })}
        </Box>
    )

}

export default function MessageBox(props) {
    const { timestamp, role, content } = props;

    const isUser = role === "user";
    const isSystem = role === "system";
    const timeString = new Date(timestamp);

    return (
        <Box display={isSystem ? "none" : "flex"} justifyContent={isUser ? "flex-end" : "flex-start"} gap={1}>
            <Box display="flex" maxWidth="60%"
                sx={{
                    borderRadius: "12px",
                    border: isUser ? "0.5px solid #6fa49c" : "0.5px solid #616266",
                    backgroundColor: isUser ? "#1f242d" : "#282930",
                    whiteSpace: 'pre-line',
                    order: isUser ? 2 : 1,
                }}
                textAlign="left"
                px={3}
                py={2}
                color={isUser ? "#6fa49c" : "#bdbec2"}
            >
                <ParseContent isUser={isUser} content={content}></ParseContent>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="flex-end"
                sx={{
                    order: isUser ? 1 : 2
                }}
            >
                <Typography sx={{ color: "grey" }} fontSize="14px" fontWeight="light" fontStyle='oblique'>{timeString.toLocaleTimeString()}</Typography>
            </Box>
        </Box>
    )
}