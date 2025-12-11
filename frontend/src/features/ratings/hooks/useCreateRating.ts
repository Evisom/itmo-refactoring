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

    const optimisticRating: RatingResponse = {
      id: Date.now(),
      bookId: data.bookId,
      userId: "",
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString(),
    };

    const cacheKey = ["ratings", { bookId: data.bookId }, token];

    try {
      const previousData = await mutate(cacheKey);
      
      await mutate(
        cacheKey,
        async (current: RatingResponse[] | undefined) => {
          if (!current) return [optimisticRating];
          return [optimisticRating, ...current];
        },
        false
      );

      const rating = await ratingsApi.createRating(token, data);

      await mutate(
        cacheKey,
        async (current: RatingResponse[] | undefined) => {
          if (!current) return [rating];
          return current.map((r) => (r.id === optimisticRating.id ? rating : r));
        },
        false
      );

      await mutate(cacheKey);
      return rating;
    } catch (err) {
      const rollbackData = await mutate(cacheKey);
      if (rollbackData) {
        await mutate(cacheKey, rollbackData, false);
      }
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
