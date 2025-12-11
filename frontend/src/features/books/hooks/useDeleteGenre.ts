"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import genresApi from "../services/genres-api";
import { mutate } from "swr";

export const useDeleteGenre = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deleteGenre = async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await genresApi.deleteGenre(token, id);
      mutate([`${token ? "genres" : null}`, token]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteGenre,
    isLoading,
    error,
  };
};

export default useDeleteGenre;
