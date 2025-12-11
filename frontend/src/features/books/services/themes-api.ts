import fetcher from "@/shared/services/api-client";
import { config } from "@/shared/utils/config";

export interface ThemeResponse {
  id: number;
  name: string;
}

export interface ThemeCreateRequest {
  name: string;
}

const themesApi = {
  getThemes: async (token: string | null): Promise<ThemeResponse[]> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.API_V2_URL}/themes`, token);
  },

  createTheme: async (token: string | null, data: ThemeCreateRequest): Promise<ThemeResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/themes`, {
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

export default themesApi;
