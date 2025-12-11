import fetcher from "@/shared/services/api-client";
import apiFetch from "@/shared/services/api-fetch-helper";
import { config } from "@/shared/utils/config";
import type {
  LibraryResponse,
  LibraryCreateRequest,
  LibraryUpdateRequest,
  LibraryCopiesResponse,
} from "@/shared/types/api";


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
    const response = await apiFetch(`${config.API_V2_URL}/libraries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  updateLibrary: async (token: string | null, id: number, data: LibraryUpdateRequest): Promise<LibraryResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.API_V2_URL}/libraries/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  deleteLibrary: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    await apiFetch(`${config.API_V2_URL}/libraries/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export default librariesApi;
