import fetcher from "@/shared/services/api-client";
import { config } from "@/shared/utils/config";

export interface GenreResponse {
  id: number;
  name: string;
}

export interface GenreCreateRequest {
  name: string;
}

const genresApi = {
  getGenres: async (token: string | null): Promise<GenreResponse[]> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.API_V2_URL}/genres`, token);
  },

  createGenre: async (token: string | null, data: GenreCreateRequest): Promise<GenreResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/genres`, {
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

export default genresApi;
