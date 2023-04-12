import { Box, Skeleton, CircularProgress } from "@mui/material"


export default function LoadingBox(props) {
    const { queryInProgress } = props;

    return (
        <Box display={queryInProgress ? "flex" : "none"} alignItems="flex-end" gap={2}>
            <Skeleton sx={{ backgroundColor: "#282930", border: "0.5px solid #616266" }} animation="wave" variant="rounded" width={270} height={70} />
            <CircularProgress size={20}></CircularProgress>
        </Box>
    )
}