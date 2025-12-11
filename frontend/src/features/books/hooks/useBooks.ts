"use client";

import useSWR from "swr";
import booksApi from "@/features/books/services/books-api";
import type { BookListResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";

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

  // Отключаем кеширование полностью - всегда загружаем данные заново
  // Используем dedupingInterval: 0 для отключения дедупликации
  const { data, error, isLoading, isValidating, mutate } = useSWR<BookListResponse>(
    token ? ["books", params, token] : null,
    () => booksApi.getBooks(token, params),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      revalidateOnMount: true,
      dedupingInterval: 0, // Отключаем дедупликацию - всегда загружаем заново
      keepPreviousData: false,
      refreshInterval: 0,
      shouldRetryOnError: false,
    }
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

