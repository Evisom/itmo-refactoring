import fetcher from "@/shared/services/api-client";
import { config } from "@/shared/utils/config";
import type {
  BookCopyResponse,
  BookCopyListResponse,
  BookCopyCreateRequest,
  BookCopyUpdateRequest,
} from "@/shared/types/api";

const bookCopiesApi = {
  getBookCopies: async (
    token: string | null,
    params?: { page?: number; size?: number }
  ): Promise<BookCopyListResponse> => {
    if (!token) throw new Error("No token provided");
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append("page", params.page.toString());
    if (params?.size !== undefined) searchParams.append("size", params.size.toString());

    const queryString = searchParams.toString();
    const url = `${config.API_V2_URL}/book-copies${queryString ? `?${queryString}` : ""}`;
    return fetcher(url, token);
  },

  getBookCopy: async (token: string | null, id: number): Promise<BookCopyResponse> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.API_V2_URL}/book-copies/${id}`, token);
  },

  createBookCopy: async (token: string | null, data: BookCopyCreateRequest): Promise<BookCopyResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/book-copies`, {
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

  updateBookCopy: async (token: string | null, id: number, data: BookCopyUpdateRequest): Promise<BookCopyResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/book-copies/${id}`, {
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

  deleteBookCopy: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/book-copies/${id}`, {
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

export default bookCopiesApi;
