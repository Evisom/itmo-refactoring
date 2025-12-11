"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import genresApi from "../services/genres-api";
import type { GenreCreateRequest, GenreResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useCreateGenre = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createGenre = async (data: GenreCreateRequest): Promise<GenreResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await genresApi.createGenre(token, data);
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
    createGenre,
    isLoading,
    error,
  };
};

export default useCreateGenre;
