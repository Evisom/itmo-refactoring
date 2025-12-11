"use client";

import useSWR from "swr";
import publishersApi from "@/features/books/services/publishers-api";
import type { PublisherResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { defaultSWROptions } from "@/shared/services/swr-config";

export const usePublishers = () => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<PublisherResponse[]>(
    token ? ["publishers", token] : null,
    () => publishersApi.getPublishers(token),
    {
      defaultSWROptions
    }
  );

  return {
    publishers: data || [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default usePublishers;

