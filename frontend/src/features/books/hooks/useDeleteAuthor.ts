"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import authorsApi from "../services/authors-api";
import { mutate } from "swr";

export const useDeleteAuthor = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deleteAuthor = async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await authorsApi.deleteAuthor(token, id);
      mutate([`${token ? "authors" : null}`, token]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteAuthor,
    isLoading,
    error,
  };
};

export default useDeleteAuthor;

