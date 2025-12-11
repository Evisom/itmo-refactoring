"use client";

import useSWR from "swr";
import authorsApi from "@/features/books/services/authors-api";
import type { AuthorResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { defaultSWROptions } from "@/shared/services/swr-config";

export const useAuthors = () => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<AuthorResponse[]>(
    token ? ["authors", token] : null,
    () => authorsApi.getAuthors(token),
    defaultSWROptions
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
