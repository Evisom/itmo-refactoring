import fetcher from "@/shared/services/api-client";
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
    const response = await fetch(`${config.API_V2_URL}/publishers`, {
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

  updatePublisher: async (token: string | null, id: number, data: PublisherUpdateRequest): Promise<PublisherResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/publishers/${id}`, {
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

  deletePublisher: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/publishers/${id}`, {
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

export default publishersApi;
