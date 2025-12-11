"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import bookCopiesApi from "../services/book-copies-api";
import { mutate } from "swr";

export const useDeleteBookCopy = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deleteBookCopy = async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await bookCopiesApi.deleteBookCopy(token, id);
      mutate([`${token ? "book-copies" : null}`, token]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteBookCopy,
    isLoading,
    error,
  };
};

export default useDeleteBookCopy;

