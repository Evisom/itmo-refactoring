import fetcher from "@/shared/services/api-client";
import { config } from "@/shared/utils/config";

export interface PublisherResponse {
  id: number;
  name: string;
}

export interface PublisherCreateRequest {
  name: string;
}

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
};

export default publishersApi;
