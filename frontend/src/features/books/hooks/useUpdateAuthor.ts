"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import authorsApi from "../services/authors-api";
import type { AuthorUpdateRequest, AuthorResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useUpdateAuthor = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateAuthor = async (id: number, data: AuthorUpdateRequest): Promise<AuthorResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authorsApi.updateAuthor(token, id, data);
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
    updateAuthor,
    isLoading,
    error,
  };
};

export default useUpdateAuthor;
