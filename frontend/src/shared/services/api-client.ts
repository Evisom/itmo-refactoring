export const fetcher = async (url: string, token: string | null) => {
  if (!token) {
    throw new Error("No token provided");
  }

  const response = await fetch(url, {
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
};

export default fetcher;
