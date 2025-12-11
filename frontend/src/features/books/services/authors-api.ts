import fetcher from "@/shared/services/api-client";
import { config } from "@/shared/utils/config";

export interface AuthorResponse {
  id: number;
  name: string;
  surname: string;
  birthDate?: string;
}

export interface AuthorCreateRequest {
  name: string;
  surname: string;
  birthDate?: string;
}

const authorsApi = {
  getAuthors: async (token: string | null): Promise<AuthorResponse[]> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.API_V2_URL}/authors`, token);
  },

  createAuthor: async (token: string | null, data: AuthorCreateRequest): Promise<AuthorResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/authors`, {
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

export default authorsApi;
