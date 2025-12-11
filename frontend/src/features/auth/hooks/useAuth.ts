"use client";

import { useContext } from "react";
import { AuthContext } from "@/features/auth/components/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const useHasRole = (role: string): boolean => {
  const { roles } = useAuth();
  return roles.includes(role);
};

export const useHasAnyRole = (requiredRoles: string[]): boolean => {
  const { roles } = useAuth();
  return requiredRoles.some((role) => roles.includes(role));
};

export default useAuth;

