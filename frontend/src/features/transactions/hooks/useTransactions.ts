"use client";

import useSWR from "swr";
import transactionsApi from "@/features/transactions/services/transactions-api";
import type { TransactionResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { defaultSWROptions } from "@/shared/services/swr-config";

interface UseTransactionsParams {
  libraryId?: number;
  userId?: string;
  status?: string;
  page?: number;
  size?: number;
}

export const useTransactions = (params?: UseTransactionsParams) => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<TransactionResponse[]>(
    token ? ["transactions", params, token] : null,
    () => transactionsApi.getTransactions(token, params),
    defaultSWROptions
  );

  return {
    transactions: data || [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useTransactions;

