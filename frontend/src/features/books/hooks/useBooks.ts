"use client";

import useSWR from "swr";
import booksApi from "@/features/books/services/books-api";
import type { BookListResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { defaultSWROptions } from "@/shared/services/swr-config";

interface UseBooksParams {
  page?: number;
  size?: number;
  name?: string;
  genres?: string[];
  themes?: string[];
  publishers?: string[];
  authors?: string[];
  minCopies?: number;
  maxCopies?: number;
  rating?: number[];
  available?: boolean;
}

export const useBooks = (params?: UseBooksParams) => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<BookListResponse>(
    token ? ["books", params, token] : null,
    () => booksApi.getBooks(token, params),
    defaultSWROptions
  );

  return {
    books: data?.content || [],
    totalElements: data?.totalElements || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useBooks;
