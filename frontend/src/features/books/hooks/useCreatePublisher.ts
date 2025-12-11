"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import publishersApi from "../services/publishers-api";
import type { PublisherCreateRequest, PublisherResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useCreatePublisher = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createPublisher = async (data: PublisherCreateRequest): Promise<PublisherResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await publishersApi.createPublisher(token, data);
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
    createPublisher,
    isLoading,
    error,
  };
};

export default useCreatePublisher;

