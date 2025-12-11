"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import transactionsApi from "@/features/transactions/services/transactions-api";
import type { TransactionResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useReturnTransaction = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const returnTransaction = async (params?: { invNumber?: string }): Promise<TransactionResponse | null> => {
    if (!token) {
      throw new Error("No token provided");
    }

    setIsLoading(true);
    setError(null);

    try {
      const transaction = await transactionsApi.returnTransaction(token, params?.invNumber);
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
    returnTransaction,
    isLoading,
    error,
  };
};

export default useReturnTransaction;

