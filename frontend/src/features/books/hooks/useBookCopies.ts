"use client";

import useSWR from "swr";
import booksApi from "@/features/books/services/books-api";
import type { BookListResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface UseBookCopiesParams {
  page?: number;
  size?: number;
}

export const useBookCopies = (bookId: number | null, params?: UseBookCopiesParams) => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<BookListResponse>(
    token && bookId ? ["bookCopies", bookId, params, token] : null,
    () => booksApi.getBookCopies(token, bookId!, params),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    copies: data?.content || [],
    totalElements: data?.totalElements || 0,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useBookCopies;
