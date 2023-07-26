import { Box } from "@mui/material";

import { PromptsList } from "./promptsList";
import { AddPromptForm } from "./AddPromptForm";

type PromptManageProps = {
  toggle: boolean;
};

export const PromptManage = (props: PromptManageProps) => {
  const { toggle = false } = props;
  //   const [togglePrompts, setTogglePrompts] = useState(true);
  return (
    <Box
      minWidth="200px"
      display={toggle ? "flex" : "none"}
      flexDirection="column"
      px={1}
      pb={3}
    >
      <PromptsList />
      <AddPromptForm />
    </Box>
  );
};
