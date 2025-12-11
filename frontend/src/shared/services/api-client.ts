import { parseError, logError } from "@/shared/utils/error-handler";

export const fetcher = async (url: string, token: string | null) => {
  if (!token) {
    throw new Error("No token provided");
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const parsedError = parseError(error);
    logError(parsedError, `fetcher: ${url}`);
    throw parsedError;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      errorCode: "UNKNOWN_ERROR",
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    
    const parsedError = parseError(errorData, response.status);
    logError(parsedError, `fetcher: ${url}`);
    throw parsedError;
  }

  return response.json();
};

export default fetcher;
