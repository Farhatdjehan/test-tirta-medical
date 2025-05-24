"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  styled,
  TextField,
} from "@mui/material";
import styles from "../../app/page.module.css";
import { useRouter } from "next/navigation";

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
};

export default function LoginForm() {
  const userListData = localStorage.getItem("userList");
  const router = useRouter();
  const [userList, setUserList] = useState<DataLogin[]>([]);
  const [dataLogin, setDataLogin] = useState(defaultUserLogin);

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDataLogin({
      ...dataLogin,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const existingUser = userList.find(
      (user) => user.email === dataLogin.email
    );

    if (existingUser) {
      localStorage.setItem("userLogin", JSON.stringify(existingUser));
      router.push("/dashboard");
    } else {
      const newUser = {
        ...dataLogin,
        id: Date.now(),
      };

      const updatedList = [...userList, newUser];
      setUserList(updatedList);
      localStorage.setItem("userLogin", JSON.stringify(newUser));
      localStorage.setItem("userList", JSON.stringify(updatedList));
      router.push("/dashboard");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <FormControl fullWidth required>
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
          id="email"
          name="email"
          type="email"
          variant="outlined"
          placeholder="Email"
          value={dataLogin.email}
          onChange={handleChange}
          sx={{ marginBottom: 3 }}
        />
      </FormControl>
      <FormControl fullWidth required>
        <FormLabel sx={{ fontWeight: 400, marginBottom: 1 }}>
          Password
        </FormLabel>
        <StyledTextField
          id="password"
          name="password"
          type="password"
          variant="outlined"
          placeholder="Password"
          value={dataLogin.password}
          onChange={handleChange}
          sx={{ marginBottom: 5 }}
        />
      </FormControl>
      <Button variant="contained" fullWidth type="submit" size="large">
        Sign In
      </Button>
      <div className={styles.divider}>
        <span>Or</span>
      </div>
      <Button variant="contained" fullWidth type="submit" size="large">
        Sign In
      </Button>
    </Box>
  );
}

const defaultUserLogin = {
  id: 1,
  email: "",
  password: "",
};
