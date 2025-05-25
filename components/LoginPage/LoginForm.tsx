"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  TextField,
} from "@mui/material";
import styles from "../../app/page.module.css";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E0E0",
    },
    "&:hover fieldset": {
      borderColor: "#2F80ED",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2F80ED",
    },
  },
  "& .MuiInputBase-input": {
    padding: "12px 16px",
    fontSize: "16px",
  },
});

type DataLogin = {
  id: number;
  email: string;
  password: string;
  is_google: boolean;
};

export default function LoginForm() {
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Format email tidak valid")
      .required("Email wajib diisi"),
    password: yup.string().required("Password wajib diisi"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });
  const userListData = localStorage.getItem("userList");
  const router = useRouter();
  const [userList, setUserList] = useState<DataLogin[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const userLogin = localStorage.getItem("userLogin");
    if (userLogin) router.push("/dashboard");
  }, []);

  useEffect(() => {
    if (userListData) {
      setUserList(JSON.parse(userListData));
    } else {
      setUserList([]);
      localStorage.setItem("userList", JSON.stringify([]));
    }
  }, []);

  const handleSelect = (email: string) => {
    setOpen(false);

    const existingUser = userList.find((user) => user.email === email);

    if (existingUser) {
      localStorage.setItem("userLogin", JSON.stringify(existingUser));
      router.push("/dashboard");
    } else {
      const newUser = {
        email,
        password: "",
        id: Date.now(),
        is_google: true,
      };

      const updatedList = [...userList, newUser];
      setUserList(updatedList);
      localStorage.setItem("userLogin", JSON.stringify(newUser));
      localStorage.setItem("userList", JSON.stringify(updatedList));
      router.push("/dashboard");
    }
  };

  const onSubmit = (data: { email: string; password: string }) => {
    const existingUser = userList.find((user) => user.email === data.email);

    if (existingUser) {
      if (existingUser.password !== data.password) {
        // password salah, set error manual
        setError("password", {
          type: "manual",
          message: "Password salah",
        });
        return; // stop proses login
      }
      localStorage.setItem("userLogin", JSON.stringify(existingUser));
      router.push("/dashboard");
    } else {
      const newUser = {
        ...data,
        id: Date.now(),
        is_google: false,
      };

      const updatedList = [...userList, newUser];
      setUserList(updatedList);
      localStorage.setItem("userLogin", JSON.stringify(newUser));
      localStorage.setItem("userList", JSON.stringify(updatedList));
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          fullWidth
          required
          sx={{ marginBottom: 3 }}
          error={!!errors.email}
        >
          <FormLabel
            sx={{
              fontWeight: 400,
              color: "#4F4F4F",
              fontSize: "18px",
              marginBottom: 1,
            }}
          >
            Email
          </FormLabel>
          <StyledTextField
            variant="outlined"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <FormHelperText>{errors.email.message}</FormHelperText>
          )}
        </FormControl>
        <FormControl
          fullWidth
          required
          sx={{ marginBottom: 5 }}
          error={!!errors.password}
        >
          <FormLabel sx={{ fontWeight: 400, marginBottom: 1 }}>
            Password
          </FormLabel>
          <StyledTextField
            variant="outlined"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <FormHelperText>{errors.password.message}</FormHelperText>
          )}
        </FormControl>
        <Button variant="contained" fullWidth type="submit" size="large">
          Sign In
        </Button>
        <div className={styles.divider}>
          <span>Or</span>
        </div>
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          fullWidth
          type="button"
          size="large"
        >
          Sign in with Google
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Pilih akun Google</DialogTitle>
        <List>
          {dummyEmails.map((email) => (
            <ListItem disablePadding key={email}>
              <ListItemButton onClick={() => handleSelect(email)}>
                <ListItemText primary={email} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  );
}

const defaultUserLogin = {
  id: 1,
  email: "",
  password: "",
  is_google: false,
};

const dummyEmails = ["user1@gmail.com", "admin@example.com", "demo@dummy.com"];
