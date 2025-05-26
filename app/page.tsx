import { Box, Grid } from "@mui/material";
import styles from "./page.module.css";
import LoginForm from "@/components/LoginPage/LoginForm";
import Image from "next/image";
import Illustration from "@/public/illustration-login.png";
import ornamentOne from "@/public/ornament1.svg";
import ornamentTwo from "@/public/ornament2.svg";

export default function Home() {
  return (
    <Box component="main">
      <Grid container>
        <Grid
          size={6}
          sx={{
            backgroundColor: "#F8FAFF",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            display: {
              xs: "none",
              sm: "none",
              md: "flex",
            },
          }}
        >
          <Image
            src={Illustration}
            alt="Illustration"
            style={{ width: "100%", height: "auto" }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <div className={styles.page}>
            <Image
              src={ornamentOne}
              alt="Illustration"
              style={{
                position: "absolute",
                top: "0",
                right: "2rem",
                zIndex: "-1",
              }}
            />
            <Image
              src={ornamentTwo}
              alt="Illustration"
              style={{
                position: "absolute",
                bottom: "0",
                left: "2rem",
                zIndex: "-1",
              }}
            />
            <div className={styles.title}>Welcome Back</div>
            <LoginForm />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
