import fetcher from "@/shared/services/api-client";
import { config } from "@/shared/utils/config";
import type {
  AuthorResponse,
  AuthorCreateRequest,
  AuthorUpdateRequest,
} from "@/shared/types/api";

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

  updateAuthor: async (token: string | null, id: number, data: AuthorUpdateRequest): Promise<AuthorResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/authors/${id}`, {
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

  deleteAuthor: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/authors/${id}`, {
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

export default authorsApi;
