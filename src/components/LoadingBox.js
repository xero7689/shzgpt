import { Box, Skeleton, CircularProgress } from "@mui/material"


export default function LoadingBox(props) {
    const { queryInProgress } = props;

    return (
        <Box display={queryInProgress ? "flex" : "none"} alignItems="flex-end" gap={2}>
            <Skeleton sx={{ backgroundColor: "primary.main", border: "0.5px solid", borderColor: "primary.border" }} animation="wave" variant="rounded" width={270} height={70} />
            <CircularProgress size={20}></CircularProgress>
        </Box>
    )
}