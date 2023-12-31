import { Code } from "@mui/icons-material";
import Box from "@mui/material/Box";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Typography } from "@mui/material";
import {
  tomorrow,
  gruvboxDark,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import Button from "@mui/material/Button";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { useState } from "react";
import { isMobileOnly } from "react-device-detect";

type CodeBlockProps = {
  codeString: string;
  language: string;
  colorMode: string;
};

const CodeBlock = (props: CodeBlockProps) => {
  const { codeString, language, colorMode } = props;

  const [_, setCopySuccess] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(codeString);
    setCopySuccess(true);
  };

  return (
    <Box border="1px solid" borderColor="info.border">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: "info.main",
          borderRadius: "4px",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        }}
        px={2}
      >
        <Box display="flex" gap={1}>
          <Code></Code>
          <Typography fontSize={14} fontWeight="bold" color="info.contrastText">
            {language}
          </Typography>
        </Box>
        <Button
          variant="text"
          size="small"
          startIcon={<CopyAllIcon sx={{ color: "primary.contrastText" }} />}
          onClick={handleCopyClick}
        >
          <Typography color="primary.contrastText" fontSize={12}>
            Copy Code
          </Typography>
        </Button>
      </Box>
      <Box>
        <SyntaxHighlighter
          language={language}
          style={colorMode === "light" ? tomorrow : gruvboxDark}
          showLineNumbers
          customStyle={{
            margin: 0,
            paddingTop: "24px",
            paddingBottom: "24px",
          }}
          wrapLines={true}
        >
          {codeString}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
};

export default CodeBlock;
