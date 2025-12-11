"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import booksApi from "@/features/books/services/books-api";
import type { BookCreateRequest, BookResponse } from "@/shared/types/api";
import { useSWRConfig } from "swr";

export const useCreateBook = () => {
  const { token } = useAuth();
  const { cache, mutate } = useSWRConfig();
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

      // Инвалидируем все запросы к списку книг
      // Кеш отключен, но все равно инвалидируем для гарантии
      await mutate(
        (key) => {
          if (!Array.isArray(key)) return false;
          if (key[0] !== "books") return false;
          if (key.length >= 3 && key[2] !== token) return false;
          return true;
        },
        undefined,
        { revalidate: true }
      );

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

