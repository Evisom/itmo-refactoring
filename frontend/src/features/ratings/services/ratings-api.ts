import fetcher from "@/shared/services/api-client";
import { config } from "@/shared/utils/config";

export interface RatingResponse {
  id: number;
  userId: string;
  bookId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface RatingCreateRequest {
  bookId: number;
  rating: number;
  comment?: string;
}

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

    const searchParams = new URLSearchParams();
    if (params?.bookId !== undefined) searchParams.append("bookId", params.bookId.toString());
    if (params?.userId) searchParams.append("userId", params.userId);
    if (params?.page !== undefined) searchParams.append("page", params.page.toString());
    if (params?.size !== undefined) searchParams.append("size", params.size.toString());

    const queryString = searchParams.toString();
    const url = `${config.OPERATION_API_V2_URL}/ratings${queryString ? `?${queryString}` : ""}`;
    return fetcher(url, token);
  },

  createRating: async (token: string | null, data: RatingCreateRequest): Promise<RatingResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.OPERATION_API_V2_URL}/ratings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        errorCode: "UNKNOWN_ERROR",
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw error;
    }

    return response.json();
  },
};

export default ratingsApi;
