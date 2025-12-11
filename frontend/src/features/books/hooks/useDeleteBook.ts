"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import booksApi from "@/features/books/services/books-api";
import { mutate } from "swr";

export const useDeleteBook = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deleteBook = async (id: number): Promise<void> => {
    if (!token) {
      throw new Error("No token provided");
    }

    setIsLoading(true);
    setError(null);

    try {
      await booksApi.deleteBook(token, id);
      await mutate(["books", undefined, token]);
      await mutate(["book", id, token]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteBook,
    isLoading,
    error,
  };
};

export default useDeleteBook;

