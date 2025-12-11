"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import ratingsApi from "@/features/ratings/services/ratings-api";
import type { RatingCreateRequest, RatingResponse } from "@/shared/types/api";
import { mutate } from "swr";

export const useCreateRating = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const createRating = async (data: RatingCreateRequest): Promise<RatingResponse | null> => {
    if (!token) {
      throw new Error("No token provided");
    }

    setIsLoading(true);
    setError(null);

    try {
      const rating = await ratingsApi.createRating(token, data);
      await mutate(["ratings", { bookId: data.bookId }, token]);
      return rating;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createRating,
    isLoading,
    error,
  };
};

export default useCreateRating;
