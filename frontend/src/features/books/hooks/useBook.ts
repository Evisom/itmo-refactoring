"use client";

import useSWR from "swr";
import booksApi from "@/features/books/services/books-api";
import type { BookResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { defaultSWROptions } from "@/shared/services/swr-config";

export const useBook = (id: number | null) => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<BookResponse>(
    token && id ? ["book", id, token] : null,
    () => booksApi.getBook(token, id!),
    defaultSWROptions
  );

  return {
    book: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useBook;
