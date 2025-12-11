"use client";

import useSWR from "swr";
import { transactionsApi, ReadingStatusResponse } from "@/features/transactions/services/transactions-api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useReadingStatus = (bookId: number | null) => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<ReadingStatusResponse>(
    token && bookId ? ["readingStatus", bookId, token] : null,
    () => transactionsApi.getReadingStatus(token, bookId!),
    {
      revalidateOnFocus: false,
    }
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
