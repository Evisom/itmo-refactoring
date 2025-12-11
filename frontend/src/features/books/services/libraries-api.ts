import fetcher from "@/shared/services/api-client";
import { config } from "@/shared/utils/config";

export interface LibraryResponse {
  id: number;
  name: string;
  address?: string;
}

export interface LibraryCreateRequest {
  name: string;
  address?: string;
}

export interface LibraryCopiesResponse {
  content: Array<{
    id: number;
    inventoryNumber: string;
    book: {
      id: number;
      title: string;
      authors?: Array<{ id: number; name: string; surname: string }>;
    };
  }>;
  totalElements: number;
  totalPages: number;
}

const librariesApi = {
  getLibraries: async (token: string | null): Promise<LibraryResponse[]> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.API_V2_URL}/libraries`, token);
  },

  getLibraryCopies: async (
    token: string | null,
    libraryId: number,
    params?: { page?: number; size?: number }
  ): Promise<LibraryCopiesResponse> => {
    if (!token) throw new Error("No token provided");
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append("page", params.page.toString());
    if (params?.size !== undefined) searchParams.append("size", params.size.toString());

    const queryString = searchParams.toString();
    const url = `${config.API_V2_URL}/libraries/${libraryId}/copies${queryString ? `?${queryString}` : ""}`;
    return fetcher(url, token);
  },

  createLibrary: async (token: string | null, data: LibraryCreateRequest): Promise<LibraryResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/libraries`, {
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

export default librariesApi;
