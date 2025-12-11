"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import authorsApi from "../services/authors-api";
import type { AuthorCreateRequest, AuthorResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useCreateAuthor = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createAuthor = async (data: AuthorCreateRequest): Promise<AuthorResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authorsApi.createAuthor(token, data);
      mutate([`${token ? "authors" : null}`, token]);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createAuthor,
    isLoading,
    error,
  };
};

export default useCreateAuthor;
