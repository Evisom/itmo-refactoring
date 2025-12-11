import fetcher from "@/shared/services/api-client";
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

    const searchParams = new URLSearchParams();
    if (params?.libraryId !== undefined) searchParams.append("libraryId", params.libraryId.toString());
    if (params?.userId) searchParams.append("userId", params.userId);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.page !== undefined) searchParams.append("page", params.page.toString());
    if (params?.size !== undefined) searchParams.append("size", params.size.toString());

    const queryString = searchParams.toString();
    const url = `${config.OPERATION_API_V2_URL}/transactions${queryString ? `?${queryString}` : ""}`;
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
    const response = await fetch(`${config.OPERATION_API_V2_URL}/transactions?bookId=${data.bookId}&libraryId=${data.libraryId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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

  approveTransaction: async (token: string | null, id: number): Promise<TransactionResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.OPERATION_API_V2_URL}/transactions/${id}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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

  declineTransaction: async (
    token: string | null,
    id: number,
    data: TransactionDeclineRequest
  ): Promise<TransactionResponse> => {
    if (!token) throw new Error("No token provided");
    const response = await fetch(`${config.OPERATION_API_V2_URL}/transactions/${id}/decline`, {
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
    const response = await fetch(`${config.OPERATION_API_V2_URL}/transactions/${id}`, {
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

  getReadingStatus: async (token: string | null, bookId: number): Promise<ReadingStatusResponse> => {
    if (!token) throw new Error("No token provided");
    return fetcher(`${config.OPERATION_API_V2_URL}/transactions/reading-status?bookId=${bookId}`, token);
  },
};

export default transactionsApi;
