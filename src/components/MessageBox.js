import React from 'react';
import { useMemo } from 'react';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import CodeBlock from "./CodeBlock";

function separateCodeBlocks(rawString) {
    const pattern = /```([^\n]+)?\n([\s\S]+?)\n```/g;
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
    const blocks = useMemo(() => separateCodeBlocks(content), [content]);

    return (
        <Box sx={{ overflow: "auto" }} display="flex" flexDirection="column">
            {blocks.map((block, index) => {
                if (block.type === "code") {
                    return (
                        <CodeBlock key={index} codeString={block.content} language={block.language}></CodeBlock>
                    )
                }
                return (
                    <Box key={index}>
                        <Typography sx={{ lineHeight: "1.75", maxWidth: "79ch" }}>
                            {isUser ? block.content.trim() : block.content}
                        </Typography>
                    </Box>
                )
            })}
        </Box>
    )

}

const MessageBox = React.memo(function MessageBox(props) {
    const { timestamp, role, content } = props;

    const isUser = role === "user";
    const isSystem = role === "system";
    const timeString = new Date(timestamp);

    return (
        <Box
            display="flex"
            sx={{
                justifyContent: {
                    md: isUser ? "flex-end" : "flex-start"
                },
                display: {
                    xs: isSystem ? "none" : "block",
                    md: isSystem ? "none" : "flex"
                },
            }}
            gap={1}
        >
            <Box display="flex"
                sx={{
                    borderRadius: "12px",
                    border: isUser ? "0.5px solid #6fa49c" : "0.5px solid #616266",
                    backgroundColor: isUser ? "#1f242d" : "#282930",
                    whiteSpace: 'pre-line',
                    order: {
                        md: isUser ? 2 : 1,
                    },
                    marginLeft: {
                        xs: isUser ? "auto" : 0,
                        md: 0
                    },
                }}
                maxWidth="fit-content"
                textAlign="left"
                px={{
                    xs: 2,
                    md: 3
                }}
                py={{
                    xs: 1,
                    md: 2
                }}
                color={isUser ? "#6fa49c" : "#bdbec2"}
            >
                <ParseContent isUser={isUser} content={content}></ParseContent>
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="flex-end" alignItems={{ xs: "end" }}
                sx={{
                    order: {
                        md: isUser ? 1 : 2
                    },
                }}
                mt={{
                    xs: 1,
                    md: 0
                }}
            >
                <Typography sx={{ color: "grey" }} fontSize="14px" fontWeight="light" fontStyle='oblique'>{timeString.toLocaleTimeString()}</Typography>
            </Box>
        </Box >
    )
});

export default MessageBox;