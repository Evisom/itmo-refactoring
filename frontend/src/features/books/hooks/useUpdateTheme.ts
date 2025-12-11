"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import themesApi from "../services/themes-api";
import type { ThemeUpdateRequest, ThemeResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useUpdateTheme = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateTheme = async (id: number, data: ThemeUpdateRequest): Promise<ThemeResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await themesApi.updateTheme(token, id, data);
      mutate([`${token ? "themes" : null}`, token]);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateTheme,
    isLoading,
    error,
  };
};

export default useUpdateTheme;

