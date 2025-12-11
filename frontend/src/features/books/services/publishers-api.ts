import fetcher from "@/shared/services/api-client";
import apiFetch from "@/shared/services/api-fetch-helper";
import { config } from "@/shared/utils/config";
import type {
  PublisherResponse,
  PublisherCreateRequest,
  PublisherUpdateRequest,
} from "@/shared/types/api";

const publishersApi = {
  getPublishers: async (token: string | null): Promise<PublisherResponse[]> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.API_V2_URL}/publishers`, token);
  },

  createPublisher: async (token: string | null, data: PublisherCreateRequest): Promise<PublisherResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.API_V2_URL}/publishers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  updatePublisher: async (token: string | null, id: number, data: PublisherUpdateRequest): Promise<PublisherResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.API_V2_URL}/publishers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  deletePublisher: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    await apiFetch(`${config.API_V2_URL}/publishers/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export default publishersApi;

