"use client";

import Sidebar from "@/components/DashboardPage/Sidebar";
import "../globals.css";
import { Box, Grid } from "@mui/material";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("@/components/DashboardPage/Header"), {
  ssr: false,
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box>
      <Grid container>
        <Grid
          size={{
            lg: 2,
          }}
          sx={{
            display: {
              xs: "none",
              sm: "none",
              lg: "block",
            },
          }}
        >
          <Sidebar />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 10,
          }}
        >
          <Header />
          <Box
            sx={{
              height: "calc(100vh - 136px)",
              overflow: "auto",
              padding: "32px 24px",
            }}
          >
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
