"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import librariesApi from "../services/libraries-api";
import { mutate } from "swr";

export const useDeleteLibrary = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const deleteLibrary = async (id: number): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await librariesApi.deleteLibrary(token, id);
      mutate([`${token ? "libraries" : null}`, token]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteLibrary,
    isLoading,
    error,
  };
};

export default useDeleteLibrary;
