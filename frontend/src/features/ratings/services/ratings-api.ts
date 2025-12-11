import fetcher from "@/shared/services/api-client";
import apiFetch from "@/shared/services/api-fetch-helper";
import { config } from "@/shared/utils/config";
import type {
  RatingResponse,
  RatingCreateRequest,
} from "@/shared/types/api";

const ratingsApi = {
  getRatings: async (
    token: string | null,
    params?: {
      bookId?: number;
      userId?: string;
      page?: number;
      size?: number;
    }
  ): Promise<RatingResponse[]> => {
    if (!token) throw new Error("No token provided");
    if (!params?.bookId) {
      return [];
    }

    const searchParams = new URLSearchParams();
    searchParams.append("bookId", params.bookId.toString());
    if (params?.userId) searchParams.append("userId", params.userId);
    if (params?.page !== undefined) searchParams.append("page", params.page.toString());
    if (params?.size !== undefined) searchParams.append("size", params.size.toString());

    const queryString = searchParams.toString();
    const url = `${config.OPERATION_API_V2_URL}/ratings?${queryString}`;
    return fetcher(url, token);
  },

  createRating: async (token: string | null, data: RatingCreateRequest): Promise<RatingResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.OPERATION_API_V2_URL}/ratings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },
};

export default ratingsApi;
