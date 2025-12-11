"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import themesApi from "../services/themes-api";
import { mutate } from "swr";

export const useDeleteTheme = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deleteTheme = async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await themesApi.deleteTheme(token, id);
      mutate([`${token ? "themes" : null}`, token]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteTheme,
    isLoading,
    error,
  };
};

export default useDeleteTheme;

