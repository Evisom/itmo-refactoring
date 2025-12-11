import fetcher from "@/shared/services/api-client";
import apiFetch from "@/shared/services/api-fetch-helper";
import { config } from "@/shared/utils/config";
import type {
  ThemeResponse,
  ThemeCreateRequest,
  ThemeUpdateRequest,
} from "@/shared/types/api";

const themesApi = {
  getThemes: async (token: string | null): Promise<ThemeResponse[]> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.API_V2_URL}/themes`, token);
  },

  createTheme: async (token: string | null, data: ThemeCreateRequest): Promise<ThemeResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.API_V2_URL}/themes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  updateTheme: async (token: string | null, id: number, data: ThemeUpdateRequest): Promise<ThemeResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.API_V2_URL}/themes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  deleteTheme: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    await apiFetch(`${config.API_V2_URL}/themes/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export default themesApi;
