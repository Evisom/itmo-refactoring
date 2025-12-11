import { parseError, logError } from "@/shared/utils/error-handler";

export const apiFetch = async (
  url: string,
  options: RequestInit & { token?: string | null }
): Promise<Response> => {
  const { token, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    ...(fetchOptions.headers as HeadersInit),
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
  } catch (error) {
    const parsedError = parseError(error);
    logError(parsedError, `apiFetch: ${url}`);
    throw parsedError;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      errorCode: "UNKNOWN_ERROR",
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    
    const parsedError = parseError(errorData, response.status);
    logError(parsedError, `apiFetch: ${url}`);
    throw parsedError;
  }

  return response;
};

export default apiFetch;

