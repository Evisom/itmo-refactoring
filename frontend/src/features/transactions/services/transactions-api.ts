import fetcher from "@/shared/services/api-client";
import apiFetch from "@/shared/services/api-fetch-helper";
import { config } from "@/shared/utils/config";
import type {
  TransactionResponse,
  TransactionCreateRequest,
  TransactionDeclineRequest,
  ReadingStatusResponse,
} from "@/shared/types/api";

const transactionsApi = {
  getTransactions: async (
    token: string | null,
    params?: {
      libraryId?: number;
      userId?: string;
      status?: string;
      page?: number;
      size?: number;
    }
  ): Promise<TransactionResponse[]> => {
    if (!token) throw new Error("No token provided");
    
    // Для bookings API требует обязательный libraryId (для LIBRARIAN)
    // Для истории пользователя используется userId
    if (params?.libraryId === undefined && params?.userId === undefined) {
      return [];
    }

    const searchParams = new URLSearchParams();
    if (params?.libraryId !== undefined) {
      searchParams.append("libraryId", params.libraryId.toString());
    }
    if (params?.userId) {
      searchParams.append("userId", params.userId);
    }
    // status не передается в v2 API для bookings - фильтрация происходит на сервере
    if (params?.page !== undefined) {
      searchParams.append("page", params.page.toString());
    }
    if (params?.size !== undefined) {
      searchParams.append("size", params.size.toString());
    }

    const queryString = searchParams.toString();
    if (!queryString) {
      return [];
    }
    const url = `${config.OPERATION_API_V2_URL}/transactions?${queryString}`;
    return fetcher(url, token);
  },

  getTransaction: async (token: string | null, id: number): Promise<TransactionResponse> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.OPERATION_API_V2_URL}/transactions/${id}`, token);
  },

  createTransaction: async (
    token: string | null,
    data: TransactionCreateRequest
  ): Promise<TransactionResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.OPERATION_API_V2_URL}/transactions?bookId=${data.bookId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ libraryId: data.libraryId }),
      token,
    });

    return response.json();
  },

  approveTransaction: async (token: string | null, id: number): Promise<TransactionResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.OPERATION_API_V2_URL}/transactions/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      token,
    });

    return response.json();
  },

  declineTransaction: async (
    token: string | null,
    id: number,
    data: TransactionDeclineRequest
  ): Promise<TransactionResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await apiFetch(`${config.OPERATION_API_V2_URL}/transactions/${id}/decline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      token,
    });

    return response.json();
  },

  returnTransaction: async (token: string | null, invNumber?: string): Promise<TransactionResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.OPERATION_API_V2_URL}/transactions/return`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: invNumber ? JSON.stringify({ invNumber }) : undefined,
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

  cancelTransaction: async (token: string | null, id: number): Promise<void> => {
    if (!token) throw new Error("No token provided");
    await apiFetch(`${config.OPERATION_API_V2_URL}/transactions/${id}`, {
      method: "DELETE",
      token,
    });
  },

  getReadingStatus: async (token: string | null, bookId: number): Promise<ReadingStatusResponse> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.OPERATION_API_V2_URL}/transactions/reading-status?bookId=${bookId}`, token);
  },
};

export default transactionsApi;

