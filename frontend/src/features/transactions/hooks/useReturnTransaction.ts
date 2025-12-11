"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { transactionsApi, TransactionResponse } from "@/features/transactions/services/transactions-api";
import { mutate } from "swr";

export const useReturnTransaction = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const returnTransaction = async (): Promise<TransactionResponse | null> => {
    if (!token) {
      throw new Error("No token provided");
    }

    setIsLoading(true);
    setError(null);

    try {
      const transaction = await transactionsApi.returnTransaction(token);
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
