"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import transactionsApi from "@/features/transactions/services/transactions-api";
import type { TransactionCreateRequest, TransactionResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useCreateTransaction = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createTransaction = async (data: TransactionCreateRequest): Promise<TransactionResponse | null> => {
    if (!token) {
      throw new Error("No token provided");
    }

    setIsLoading(true);
    setError(null);

    try {
      const transaction = await transactionsApi.createTransaction(token, data);
      await mutate(["transactions", undefined, token]);
      return transaction;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTransaction,
    isLoading,
    error,
  };
};

export default useCreateTransaction;
