"use client";

import useSWR from "swr";
import themesApi from "@/features/books/services/themes-api";
import type { ThemeResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { defaultSWROptions } from "@/shared/services/swr-config";

export const useThemes = () => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<ThemeResponse[]>(
    token ? ["themes", token] : null,
    () => themesApi.getThemes(token),
    defaultSWROptions
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

