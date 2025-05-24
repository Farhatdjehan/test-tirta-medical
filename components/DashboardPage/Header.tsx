import styles from "@/app/dashboard/dashboard.module.css";
import { Box, Grid, Menu, MenuItem, styled, TextField } from "@mui/material";
import calendar from "@/public/icons/calendar.png";
import userProfile from "@/public/user-profile.png";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const StyledTextField = styled(TextField)({
  "& .MuiInputBase-root": {
    backgroundColor: "#F1F3F4",
    borderRadius: "8px",
    "& fieldset": {
      border: "none",
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 18px",
    fontSize: "14px",
  },
  width: "100%",
});

export default function Header() {
    const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userLogin");
    router.push("/");
    handleClose();
  };
  return (
    <Box className={styles.header}>
      <Grid container spacing={2}>
        <Grid size={10}>
          <StyledTextField
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            fullWidth
          />
        </Grid>
        <Grid
          size={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "right",
            gap: "20px",
          }}
        >
          <Image src={calendar} alt="calendar" />
          <div className={styles.profileContainer}>
            <div>
              <div>Sudarsono</div>
              <div>Admin</div>
            </div>
            <div onClick={handleClick} style={{ cursor: "pointer" }}>
              <Image src={userProfile} alt="user-profile" />
            </div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{
                "& .MuiPaper-root": {
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  marginTop: "8px",
                },
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
