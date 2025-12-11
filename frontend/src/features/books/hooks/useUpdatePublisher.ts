"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import publishersApi from "../services/publishers-api";
import type { PublisherUpdateRequest, PublisherResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useUpdatePublisher = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updatePublisher = async (id: number, data: PublisherUpdateRequest): Promise<PublisherResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await publishersApi.updatePublisher(token, id, data);
      mutate([`${token ? "publishers" : null}`, token]);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updatePublisher,
    isLoading,
    error,
  };
};

export default useUpdatePublisher;

