"use client";

import { InputAdornment } from "@mui/material";
import Image from "next/image";
import search from "@/public/icons/search.svg"; // sesuaikan path

export default function ClientOnlyAdornment() {
  return (
    <InputAdornment position="start">
      <Image src={search} alt="search" width={16} height={16} />
    </InputAdornment>
  );
}
