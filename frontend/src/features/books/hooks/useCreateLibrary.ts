"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import librariesApi from "../services/libraries-api";
import type { LibraryCreateRequest, LibraryResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useCreateLibrary = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createLibrary = async (data: LibraryCreateRequest): Promise<LibraryResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await librariesApi.createLibrary(token, data);
      mutate([`${token ? "libraries" : null}`, token]);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createLibrary,
    isLoading,
    error,
  };
};

export default useCreateLibrary;
