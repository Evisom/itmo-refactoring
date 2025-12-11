import type { SWRConfiguration } from "swr";
import fetcher from "./api-client";

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  dedupingInterval: 2000,
  focusThrottleInterval: 5000,
};

export const createSWRKey = (key: string | null, ...args: unknown[]): [string, ...unknown[]] | null => {
  if (!key) return null;
  return [key, ...args];
};

export const getSWRFetcher = (token: string | null) => {
  return (url: string) => fetcher(url, token);
};

export const defaultSWROptions: SWRConfiguration = {
  ...swrConfig,
  onError: (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error("SWR Error:", error);
    }
  },
};

export default swrConfig;
