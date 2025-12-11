"use client";

import React from "react";
import { Typography } from "@mui/material";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";
import { BooksPage } from "@/features/books/components/BooksPage";

export default function Home() {
  const { loading } = useRequireAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div>
      <Typography variant="h4">Список книг</Typography>
      <BooksPage />
    </div>
  );
}
