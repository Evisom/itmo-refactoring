"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import booksApi from "@/features/books/services/books-api";
import type { BookCreateRequest, BookResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useCreateBook = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createBook = async (data: BookCreateRequest): Promise<BookResponse | null> => {
    if (!token) {
      throw new Error("No token provided");
    }

    setIsLoading(true);
    setError(null);

    try {
      const book = await booksApi.createBook(token, data);
      await mutate(["books", undefined, token]);
      return book;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBook,
    isLoading,
    error,
  };
};

export default useCreateBook;
