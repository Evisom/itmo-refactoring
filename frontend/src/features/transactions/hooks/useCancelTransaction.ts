"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import transactionsApi from "@/features/transactions/services/transactions-api";
import { mutate } from "swr";

export const useCancelTransaction = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const cancelTransaction = async (id: number): Promise<void> => {
    if (!token) {
      throw new Error("No token provided");
    }

    setIsLoading(true);
    setError(null);

    try {
      await transactionsApi.cancelTransaction(token, id);
      await mutate(["transactions", undefined, token]);
      await mutate(["transaction", id, token]);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    cancelTransaction,
    isLoading,
    error,
  };
};

export default useCancelTransaction;

