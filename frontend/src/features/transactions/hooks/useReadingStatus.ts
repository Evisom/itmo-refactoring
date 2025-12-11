"use client";

import useSWR from "swr";
import transactionsApi from "@/features/transactions/services/transactions-api";
import type { ReadingStatusResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";

import { defaultSWROptions } from "@/shared/services/swr-config";
export const useReadingStatus = (bookId: number | null) => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<ReadingStatusResponse>(
    token && bookId ? ["readingStatus", bookId, token] : null,
    () => transactionsApi.getReadingStatus(token, bookId!),
    defaultSWROptions
  );

  return {
    readingStatus: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useReadingStatus;
