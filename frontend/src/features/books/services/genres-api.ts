import fetcher from "@/shared/services/api-client";
import apiFetch from "@/shared/services/api-fetch-helper";
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
    const response = await apiFetch(`${config.API_V2_URL}/genres`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  updateGenre: async (token: string | null, id: number, data: GenreUpdateRequest): Promise<GenreResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.API_V2_URL}/genres/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  deleteGenre: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    await apiFetch(`${config.API_V2_URL}/genres/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export default genresApi;

