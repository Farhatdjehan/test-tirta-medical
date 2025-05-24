"use client";

import Sidebar from "@/components/DashboardPage/Sidebar";
import "../globals.css";
import { Box, Grid } from "@mui/material";
import Header from "@/components/DashboardPage/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box>
      <Grid container>
        <Grid size={2}>
          <Sidebar />
        </Grid>
        <Grid size={10}>
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
