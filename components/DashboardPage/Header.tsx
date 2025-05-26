"use client";

import styles from "@/app/dashboard/dashboard.module.css";
import {
  Box,
  Drawer,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  styled,
  TextField,
} from "@mui/material";
import calendar from "@/public/icons/calendar.png";
import userProfile from "@/public/user-profile.png";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import logoutIcon from "@/public/icons/logout.svg";
import menuBar from "@/public/icons/menu.svg";
import search from "@/public/icons/search.svg";
import dynamic from "next/dynamic";
const Sidebar = dynamic(() => import("./Sidebar"), { ssr: false });

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
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userLogin");
    }
    router.push("/");
    handleClose();
  };
  return (
    <Box className={styles.header}>
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            sm: 8,
            md: 7,
            xl: 10,
          }}
          sx={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: {
                xs: "flex",
                lg: "none",
              },
            }}
          >
            <Image onClick={toggleDrawer(true)} src={menuBar} alt="menu-bar" />
          </Box>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            <Sidebar />
          </Drawer>
          <StyledTextField
            name="email"
            type="email"
            placeholder="Email"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Image src={search} alt="search" width={16} height={16} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 4,
            md: 5,
            xl: 2,
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "right",
            gap: "20px",
          }}
        >
          <Image src={calendar} alt="calendar" />
          <div className={styles.profileContainer}>
            <div className={styles.userInfo}>
              <div className={styles.userLogin}>Sudarsono</div>
              <div className={styles.userRole}>Admin</div>
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
              <MenuItem
                onClick={handleLogout}
                sx={{ display: "flex", gap: "12px" }}
              >
                <span style={{ display: "flex" }}>
                  <Image src={logoutIcon} alt="logout" />
                </span>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
