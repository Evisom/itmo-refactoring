import fetcher from "@/shared/services/api-client";
import { config } from "@/shared/utils/config";
import type {
  GenreResponse,
  GenreCreateRequest,
  GenreUpdateRequest,
} from "@/shared/types/api";

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

  updateGenre: async (token: string | null, id: number, data: GenreUpdateRequest): Promise<GenreResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/genres/${id}`, {
      method: "PUT",
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

  deleteGenre: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/genres/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        errorCode: "UNKNOWN_ERROR",
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw error;
    }
  },
};

export default genresApi;
