"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import librariesApi from "../services/libraries-api";
import type { LibraryUpdateRequest, LibraryResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useUpdateLibrary = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateLibrary = async (id: number, data: LibraryUpdateRequest): Promise<LibraryResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await librariesApi.updateLibrary(token, id, data);
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
    updateLibrary,
    isLoading,
    error,
  };
};

export default useUpdateLibrary;
