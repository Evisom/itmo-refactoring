"use client";

import useSWR from "swr";
import { transactionsApi, TransactionResponse } from "@/features/transactions/services/transactions-api";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const useTransaction = (id: number | null) => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<TransactionResponse>(
    token && id ? ["transaction", id, token] : null,
    () => transactionsApi.getTransaction(token, id!),
    {
      revalidateOnFocus: false,
    }
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
