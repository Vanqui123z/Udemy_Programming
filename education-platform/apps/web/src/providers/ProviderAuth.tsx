"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "./contextAPI-provider";

export default function ProvidersAuth({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}