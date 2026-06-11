import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
    user: DefaultSession["user"] & {
      id: string;
      role: string;
    };
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
    role?: string;
  }
}