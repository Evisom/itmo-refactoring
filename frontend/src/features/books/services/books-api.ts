import fetcher from "@/shared/services/api-client";
import { config } from "@/shared/utils/config";
import type {
  BookResponse,
  BookListResponse,
  BookCreateRequest,
  BookUpdateRequest,
} from "@/shared/types/api";

export const booksApi = {
  getBooks: async (
    token: string | null,
    params?: {
      page?: number;
      size?: number;
      name?: string;
      genres?: string[];
      themes?: string[];
      publishers?: string[];
      authors?: string[];
      minCopies?: number;
      maxCopies?: number;
      rating?: number[];
      available?: boolean;
    }
  ): Promise<BookListResponse> => {
    if (!token) throw new Error("No token provided");

    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append("page", params.page.toString());
    if (params?.size !== undefined) searchParams.append("size", params.size.toString());
    if (params?.name) searchParams.append("name", params.name);
    if (params?.genres) params.genres.forEach((g) => searchParams.append("genres", g));
    if (params?.themes) params.themes.forEach((t) => searchParams.append("themes", t));
    if (params?.publishers) params.publishers.forEach((p) => searchParams.append("publishers", p));
    if (params?.authors) params.authors.forEach((a) => searchParams.append("authors", a));
    if (params?.minCopies !== undefined) searchParams.append("minCopies", params.minCopies.toString());
    if (params?.maxCopies !== undefined) searchParams.append("maxCopies", params.maxCopies.toString());
    if (params?.rating) {
      searchParams.append("ratingMin", params.rating[0].toString());
      searchParams.append("ratingMax", params.rating[1].toString());
    }
    if (params?.available !== undefined) searchParams.append("available", params.available.toString());

    const queryString = searchParams.toString();
    const url = `${config.API_V2_URL}/books${queryString ? `?${queryString}` : ""}`;
    return fetcher(url, token);
  },

  getBook: async (token: string | null, id: number): Promise<BookResponse> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.API_V2_URL}/books/${id}`, token);
  },

  createBook: async (token: string | null, data: BookCreateRequest): Promise<BookResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/books`, {
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

  updateBook: async (token: string | null, id: number, data: BookUpdateRequest): Promise<BookResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/books/${id}`, {
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

  deleteBook: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.API_V2_URL}/books/${id}`, {
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

  getBookCopies: async (
    token: string | null,
    bookId: number,
    params?: { page?: number; size?: number }
  ): Promise<BookListResponse> => {
    if (!token) throw new Error("No token provided");
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append("page", params.page.toString());
    if (params?.size !== undefined) searchParams.append("size", params.size.toString());

    const queryString = searchParams.toString();
    const url = `${config.API_V2_URL}/books/${bookId}/copies${queryString ? `?${queryString}` : ""}`;
    return fetcher(url, token);
  },
};

export default booksApi;
