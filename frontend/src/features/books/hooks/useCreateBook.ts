"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import booksApi from "@/features/books/services/books-api";
import type { BookCreateRequest, BookResponse, BookListResponse } from "@/shared/types/api";
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

    const optimisticBook: BookResponse = {
      id: Date.now(),
      title: data.title,
      isbn: data.isbn,
      yearPublished: data.yearPublished,
      authors: [],
      genre: undefined,
      theme: undefined,
      publisher: undefined,
      rating: 0,
    };

    const cacheKey = ["books", undefined, token];

    try {
      await mutate(
        cacheKey,
        async (current: BookListResponse | undefined) => {
          if (!current) {
            return {
              content: [optimisticBook],
              totalElements: 1,
              totalPages: 1,
              size: 10,
              number: 0,
            };
          }
          return {
            ...current,
            content: [optimisticBook, ...current.content],
            totalElements: current.totalElements + 1,
          };
        },
        false
      );

      const book = await booksApi.createBook(token, data);

      await mutate(
        cacheKey,
        async (current: BookListResponse | undefined) => {
          if (!current) return current;
          return {
            ...current,
            content: current.content.map((b) =>
              b.id === optimisticBook.id ? book : b
            ),
          };
        },
        false
      );

      await mutate(cacheKey);
      return book;
    } catch (err) {
      const previousData = await mutate(cacheKey);
      if (previousData) {
        await mutate(cacheKey, previousData, false);
      }
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
