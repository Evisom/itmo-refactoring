"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { transactionsApi, TransactionDeclineRequest, TransactionResponse } from "@/features/transactions/services/transactions-api";
import { mutate } from "swr";

export const useDeclineTransaction = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const declineTransaction = async (id: number, data: TransactionDeclineRequest): Promise<TransactionResponse | null> => {
    if (!token) {
      throw new Error("No token provided");
    }

    setIsLoading(true);
    setError(null);

    try {
      const transaction = await transactionsApi.declineTransaction(token, id, data);
      await mutate(["transactions", undefined, token]);
      await mutate(["transaction", id, token]);
      return transaction;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    declineTransaction,
    isLoading,
    error,
  };
};

export default useDeclineTransaction;
