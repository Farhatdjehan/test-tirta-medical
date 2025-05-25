import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import emptyState from "@/public/empty-state.png";

export default function EmptyState() {
  return (
    <Grid
      size={12}
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "64px",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Image src={emptyState} alt="empty-state" />
      <Typography
        variant="h6"
        sx={{ marginTop: "32px", color: "#154886", opacity: 0.6 }}
      >
        You Don't Have a Todo Yet
      </Typography>
    </Grid>
  );
}
