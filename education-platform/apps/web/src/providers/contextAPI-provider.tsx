"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

type AuthContextType = {
  user: any;
  token: string | null;
  isAuthenticated: boolean;

  // local auth
  loginWithToken: (token: string) => void;
  logout: () => void;

  // next-auth
  session: any;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);

  // load token từ localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // login bằng token (custom JWT)
  const loginWithToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // logout chung (NextAuth + local token)
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    await signOut(); 
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        token,
        isAuthenticated: !!session?.user || !!token,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// // hook dùng cho tiện
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used inside AuthProvider");
//   return context;
// }