// src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { executeQuery } from '@/lib/db';
import bcrypt from 'bcrypt';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Fetch user from database
          const users = await executeQuery(
            'SELECT u.*, r.role_name FROM users u JOIN user_roles r ON u.role_id = r.role_id WHERE username = ?',
            [credentials.username]
          );

          if (users.length === 0) {
            return null;
          }

          const user = users[0];

          // For simplicity, we're not using bcrypt to verify passwords in this project
          // In a real application, you should use bcrypt.compare to verify the password
          // const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          const passwordMatch = credentials.password === user.password;

          if (!passwordMatch) {
            return null;
          }

          // Return user object (don't include password)
          return {
            email: user.username,
            name: user.display_name,
            role: user.role_name,
            budget: user.budget,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user role to the token if available
      if (user) {
        token.role = user.role;
        token.budget = user.budget;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user role to the session from token

      session.user = session.user || {};
      if (token) {
        session.user.role = token.role;
        session.user.budget = token.budget;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST, handler as authOptions };