import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: [
      "var(--font-inter)",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  palette: {
    primary: {
      main: "#154886",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "12px",
          borderRadius: 8, // Specific for buttons
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          padding: "14px 16px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "32px",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: "#F6F6F6",
          color: "#4F4F4F",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: "none",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: "0px",
          fontSize: "0.75rem",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: "2px 5px 28px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "32px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8, // Specific for text fields
          },
        },
      },
    },
  },
});
