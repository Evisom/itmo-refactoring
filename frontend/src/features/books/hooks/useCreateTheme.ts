"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import themesApi from "../services/themes-api";
import type { ThemeCreateRequest, ThemeResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useCreateTheme = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createTheme = async (data: ThemeCreateRequest): Promise<ThemeResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await themesApi.createTheme(token, data);
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
    createTheme,
    isLoading,
    error,
  };
};

export default useCreateTheme;

