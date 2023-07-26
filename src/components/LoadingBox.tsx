import { Box, Skeleton, CircularProgress } from "@mui/material";

type LoadingBoxProps = {
  queryInProgress: boolean;
};

export default function LoadingBox(props: LoadingBoxProps) {
  const { queryInProgress } = props;

  return (
    <Box
      display={queryInProgress ? "flex" : "none"}
      alignItems="flex-end"
      gap={2}
    >
      <Skeleton
        sx={{
          backgroundColor: "primary.main",
          border: "0.5px solid",
          borderColor: "primary.border",
        }}
        animation="wave"
        variant="rounded"
        width={270}
        height={70}
      />
      <CircularProgress size={20}></CircularProgress>
    </Box>
  );
}

