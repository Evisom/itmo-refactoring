"use client";

import useSWR from "swr";
import bookCopiesApi from "@/features/books/services/book-copies-api";
import type { BookCopyListResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { defaultSWROptions } from "@/shared/services/swr-config";

interface UseAllBookCopiesParams {
  page?: number;
  size?: number;
}

export const useAllBookCopies = (params?: UseAllBookCopiesParams) => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<BookCopyListResponse>(
    token ? ["allBookCopies", params, token] : null,
    () => bookCopiesApi.getAllBookCopies(token, params),
    defaultSWROptions
  );

  return {
    copies: data?.content || [],
    totalElements: data?.totalElements || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useAllBookCopies;
