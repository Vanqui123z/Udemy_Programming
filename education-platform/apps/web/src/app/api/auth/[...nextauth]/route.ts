import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { authFetchService } from "@/services/fetchAuth.service";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXTAUTH_GOOGLE_ID!,
      clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.NEXTAUTH_GITHUB_ID!,
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        try {
          const response = await authFetchService.socialLogin({
            email: user.email!,
            full_name: user.name!,
            avatar_url: user.image!,
            provider: account.provider.toUpperCase(),
            providerId: account.providerAccountId,
          });
          console.log("Social login response:", response);

          token.provider = account.provider;
          token.accessToken = response.accessToken;
          token.refreshToken = response.refreshToken;
          token.userId = response.user.id;
          token.role = response.user.role;
        } catch (error) {
          console.error("Social login failed:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.provider = token.provider as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;

      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };