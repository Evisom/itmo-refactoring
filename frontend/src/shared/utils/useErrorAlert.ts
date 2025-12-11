"use client";

import { useState } from "react";

export const useErrorAlert = () => {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return { error, showError };
};

export default useErrorAlert;
