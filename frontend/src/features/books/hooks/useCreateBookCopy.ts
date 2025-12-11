"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import bookCopiesApi from "../services/book-copies-api";
import type { BookCopyCreateRequest, BookCopyResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useCreateBookCopy = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createBookCopy = async (data: BookCopyCreateRequest): Promise<BookCopyResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await bookCopiesApi.createBookCopy(token, data);
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
    createBookCopy,
    isLoading,
    error,
  };
};

export default useCreateBookCopy;
