import fetcher from "@/shared/services/api-client";
import apiFetch from "@/shared/services/api-fetch-helper";
import { config } from "@/shared/utils/config";
import type {
  BookCopyResponse,
  BookCopyListResponse,
  BookCopyCreateRequest,
  BookCopyUpdateRequest,
} from "@/shared/types/api";

const bookCopiesApi = {
  getAllBookCopies: async (
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

  getBookCopies: async (
    token: string | null,
    bookId: number,
    params?: { page?: number; size?: number }
  ): Promise<BookCopyListResponse> => {
    if (!token) throw new Error("No token provided");
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append("page", params.page.toString());
    if (params?.size !== undefined) searchParams.append("size", params.size.toString());

    const queryString = searchParams.toString();
    const url = `${config.API_V2_URL}/books/${bookId}/copies${queryString ? `?${queryString}` : ""}`;
    return fetcher(url, token);
  },

  getBookCopy: async (token: string | null, id: number): Promise<BookCopyResponse> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.API_V2_URL}/book-copies/${id}`, token);
  },

  createBookCopy: async (token: string | null, data: BookCopyCreateRequest): Promise<BookCopyResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.API_V2_URL}/book-copies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  updateBookCopy: async (token: string | null, id: number, data: BookCopyUpdateRequest): Promise<BookCopyResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.API_V2_URL}/book-copies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  deleteBookCopy: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    await apiFetch(`${config.API_V2_URL}/book-copies/${id}`, {
      method: "DELETE",
      token,
    });
  },
};

export default bookCopiesApi;
