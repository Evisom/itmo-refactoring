"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { booksApi, BookUpdateRequest, BookResponse } from "@/features/books/services/books-api";
import { mutate } from "swr";

export const useUpdateBook = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateBook = async (id: number, data: BookUpdateRequest): Promise<BookResponse | null> => {
    if (!token) {
      throw new Error("No token provided");
    }

    setIsLoading(true);
    setError(null);

    try {
      const book = await booksApi.updateBook(token, id, data);
      await mutate(["book", id, token]);
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
    updateBook,
    isLoading,
    error,
  };
};

export default useUpdateBook;
