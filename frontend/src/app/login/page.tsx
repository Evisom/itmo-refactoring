"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { Login } from "@/features/auth/components/Login";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const { authenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authenticated && !loading) router.push("/");
  }, [authenticated, loading, router]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  return <Login />;
};
export default LoginPage;
