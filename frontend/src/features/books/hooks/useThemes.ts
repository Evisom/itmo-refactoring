"use client";

import useSWR from "swr";
import { themesApi, ThemeResponse } from "@/features/books/services/themes-api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useThemes = () => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<ThemeResponse[]>(
    token ? ["themes", token] : null,
    () => themesApi.getThemes(token),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    themes: data || [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useThemes;
