"use client";

import useSWR from "swr";
import { authorsApi, AuthorResponse } from "@/features/books/services/authors-api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useAuthors = () => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<AuthorResponse[]>(
    token ? ["authors", token] : null,
    () => authorsApi.getAuthors(token),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    authors: data || [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useAuthors;
