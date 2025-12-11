"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import transactionsApi from "@/features/transactions/services/transactions-api";
import type { TransactionResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useApproveTransaction = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const approveTransaction = async (id: number): Promise<TransactionResponse | null> => {
    if (!token) {
      throw new Error("No token provided");
    }

    setIsLoading(true);
    setError(null);

    const transactionsCacheKey = ["transactions", undefined, token];
    const transactionCacheKey = ["transaction", id, token];

    try {
      await mutate(
        transactionsCacheKey,
        async (current: TransactionResponse[] | undefined) => {
          if (!current) return current;
          const transactionToUpdate = current.find((t) => t.id === id);
          if (!transactionToUpdate) return current;
          const optimisticTransaction: TransactionResponse = {
            ...transactionToUpdate,
            status: "APPROVED" as const,
            updatedAt: new Date().toISOString(),
          };
          return current.map((t) => (t.id === id ? optimisticTransaction : t));
        },
        false
      );

      await mutate(
        transactionCacheKey,
        async (current: TransactionResponse | undefined) => {
          if (!current) return current;
          return {
            ...current,
            status: "APPROVED" as const,
            updatedAt: new Date().toISOString(),
          };
        },
        false
      );

      const transaction = await transactionsApi.approveTransaction(token, id);

      await mutate(transactionsCacheKey, async (current: TransactionResponse[] | undefined) => {
        if (!current) return current;
        return current.map((t) => (t.id === id ? transaction : t));
      }, false);

      await mutate(transactionCacheKey, transaction, false);

      await mutate(transactionsCacheKey);
      await mutate(transactionCacheKey);
      return transaction;
    } catch (err) {
      const previousTransactionsData = await mutate(transactionsCacheKey);
      const previousTransactionData = await mutate(transactionCacheKey);
      if (previousTransactionsData) {
        await mutate(transactionsCacheKey, previousTransactionsData, false);
      }
      if (previousTransactionData) {
        await mutate(transactionCacheKey, previousTransactionData, false);
      }
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    approveTransaction,
    isLoading,
    error,
  };
};

export default useApproveTransaction;
