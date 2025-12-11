"use client";

import useSWR from "swr";
import ratingsApi from "@/features/ratings/services/ratings-api";
import type { RatingResponse } from "@/shared/types/api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { defaultSWROptions } from "@/shared/services/swr-config";

interface UseRatingsParams {
  bookId?: number;
  userId?: string;
  page?: number;
  size?: number;
}

export const useRatings = (params?: UseRatingsParams) => {
  const { token } = useAuth();

  const { data, error, isLoading, isValidating, mutate } = useSWR<RatingResponse[]>(
    token ? ["ratings", params, token] : null,
    () => ratingsApi.getRatings(token, params),
    defaultSWROptions
  );

  return {
    ratings: data || [],
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export default useRatings;

