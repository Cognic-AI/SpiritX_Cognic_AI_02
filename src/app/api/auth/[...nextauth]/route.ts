import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

// Create a direct connection to the database to avoid model issues
const directPrisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Query user with role information
          const users = await directPrisma.$queryRaw`
            SELECT u.*, r.role_name
            FROM users u
            LEFT JOIN user_roles r ON u.role_id = r.role_id
            WHERE u.username = ${credentials.username}
          `;

          // Convert the result to a user object
          if (!Array.isArray(users) || users.length === 0) {
            return null;
          }

          const user = users[0];

          // In a production app, you'd hash passwords and use compare
          // For this demo, we'll do a direct comparison
          const isPasswordValid = credentials.password === user.password;
          // For proper security, use this instead:
          // const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.username,
            name: user.display_name || user.username,
            email: user.username, // Using username as email for NextAuth requirements
            role_id: user.role_id,
            role_name: user.role_name
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role_id = user.role_id;
        token.role_name = user.role_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role_id = token.role_id as number;
        session.user.role_name = token.role_name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 