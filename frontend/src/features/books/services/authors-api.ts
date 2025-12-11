import fetcher from "@/shared/services/api-client";
import apiFetch from "@/shared/services/api-fetch-helper";
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
    const response = await apiFetch(`${config.API_V2_URL}/authors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  updateAuthor: async (token: string | null, id: number, data: AuthorUpdateRequest): Promise<AuthorResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.API_V2_URL}/authors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  deleteAuthor: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    await apiFetch(`${config.API_V2_URL}/authors/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export default authorsApi;

