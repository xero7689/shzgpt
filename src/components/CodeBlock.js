import { Code } from '@mui/icons-material';
import Box from '@mui/material/Box';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Typography } from '@mui/material';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Button from '@mui/material/Button';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import { useState } from 'react';

const CodeBlock = (props) => {
    const { codeString, language } = props;

    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(codeString);
        setCopySuccess(true);
    }

    return (
        <Box>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    backgroundColor: "#3E3E43",
                    borderRadius: "4px",
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                }}
                px={2}
                py={1}
            >
                <Box
                    display="flex"
                    gap={1}
                >
                    <Code></Code>
                    <Typography fontSize={14} fontWeight="bold">{language}</Typography>
                </Box>
                <Button variant="text" size="small" startIcon={<CopyAllIcon />} onClick={handleCopyClick}>
                    <Typography color="#bdbec2" fontSize={12}>Copy Code</Typography>
                </Button>
            </Box>
            <SyntaxHighlighter
                language={language}
                style={gruvboxDark}
                showLineNumbers
                wrapLongLines
                customStyle={{
                    margin: 0,
                    paddingTop: '24px',
                    paddingBottom: '24px'
                }}
            >
                {codeString}
            </SyntaxHighlighter>
        </Box>

    );
};

export default CodeBlock;