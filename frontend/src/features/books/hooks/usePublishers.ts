"use client";

import useSWR from "swr";
import { publishersApi, PublisherResponse } from "@/features/books/services/publishers-api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const usePublishers = () => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<PublisherResponse[]>(
    token ? ["publishers", token] : null,
    () => publishersApi.getPublishers(token),
    {
      revalidateOnFocus: false,
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
