"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import publishersApi from "../services/publishers-api";
import { mutate } from "swr";

export const useDeletePublisher = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deletePublisher = async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await publishersApi.deletePublisher(token, id);
      mutate([`${token ? "publishers" : null}`, token]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deletePublisher,
    isLoading,
    error,
  };
};

export default useDeletePublisher;
