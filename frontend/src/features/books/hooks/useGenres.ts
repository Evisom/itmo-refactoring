"use client";

import useSWR from "swr";
import { genresApi, GenreResponse } from "@/features/books/services/genres-api";
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
