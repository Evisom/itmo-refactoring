"use client";

import React from "react";
import Book from "./Book";
import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";

const BookPage = ({ params }: { params: { id: string } }) => {
  const { id } = React.use(params);
  const { loading } = useRequireAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (id === "new") {
    return <Book type={"new"} />;
  }
  return <Book type={"edit"} id={id} />;
};

export default BookPage;
