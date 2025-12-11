"use client";

import useSWR from "swr";
import { librariesApi, LibraryResponse } from "@/features/books/services/libraries-api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useLibraries = () => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<LibraryResponse[]>(
    token ? ["libraries", token] : null,
    () => librariesApi.getLibraries(token),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    libraries: data || [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useLibraries;
