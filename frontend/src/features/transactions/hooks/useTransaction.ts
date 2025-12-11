"use client";

import useSWR from "swr";
import transactionsApi from "@/features/transactions/services/transactions-api";
import type { TransactionResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { defaultSWROptions } from "@/shared/services/swr-config";

export const useTransaction = (id: number | null) => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<TransactionResponse>(
    token && id ? ["transaction", id, token] : null,
    () => transactionsApi.getTransaction(token, id!),
    defaultSWROptions
  );

  return {
    transaction: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useTransaction;

