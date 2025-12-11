"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import booksApi from "@/features/books/services/books-api";
import type { BookUpdateRequest, BookResponse, BookListResponse } from "@/shared/types/api";
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

    const optimisticBook: BookResponse = {
      id,
      title: data.title,
      isbn: data.isbn,
      yearPublished: data.yearPublished,
      authors: [],
      genre: undefined,
      theme: undefined,
      publisher: undefined,
      rating: 0,
    };

    const bookCacheKey = ["book", id, token];
    const booksCacheKey = ["books", undefined, token];

    try {
      await mutate(bookCacheKey, optimisticBook, false);
      await mutate(
        booksCacheKey,
        async (current: BookListResponse | undefined) => {
          if (!current) return current;
          return {
            ...current,
            content: current.content.map((b) =>
              b.id === id ? optimisticBook : b
            ),
          };
        },
        false
      );

      const book = await booksApi.updateBook(token, id, data);

      await mutate(bookCacheKey, book, false);
      await mutate(
        booksCacheKey,
        async (current: BookListResponse | undefined) => {
          if (!current) return current;
          return {
            ...current,
            content: current.content.map((b) => (b.id === id ? book : b)),
          };
        },
        false
      );

      await mutate(bookCacheKey);
      await mutate(booksCacheKey);
      return book;
    } catch (err) {
      const previousBookData = await mutate(bookCacheKey);
      const previousBooksData = await mutate(booksCacheKey);
      if (previousBookData) {
        await mutate(bookCacheKey, previousBookData, false);
      }
      if (previousBooksData) {
        await mutate(booksCacheKey, previousBooksData, false);
      }
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

