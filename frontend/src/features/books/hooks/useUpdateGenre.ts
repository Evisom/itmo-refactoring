"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import genresApi from "../services/genres-api";
import type { GenreUpdateRequest, GenreResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useUpdateGenre = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateGenre = async (id: number, data: GenreUpdateRequest): Promise<GenreResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await genresApi.updateGenre(token, id, data);
      mutate([`${token ? "genres" : null}`, token]);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateGenre,
    isLoading,
    error,
  };
};

export default useUpdateGenre;
