"use client";

import useSWR from "swr";
import genresApi from "@/features/books/services/genres-api";
import type { GenreResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useGenres = () => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<GenreResponse[]>(
    token ? ["genres", token] : null,
    () => genresApi.getGenres(token),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    genres: data || [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useGenres;
