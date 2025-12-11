"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import bookCopiesApi from "../services/book-copies-api";
import type { BookCopyUpdateRequest, BookCopyResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useUpdateBookCopy = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateBookCopy = async (id: number, data: BookCopyUpdateRequest): Promise<BookCopyResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await bookCopiesApi.updateBookCopy(token, id, data);
      mutate([`${token ? "book-copies" : null}`, token]);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateBookCopy,
    isLoading,
    error,
  };
};

export default useUpdateBookCopy;

