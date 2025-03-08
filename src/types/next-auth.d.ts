import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role_id: number;
    role_name: string;
  }

  interface Session {
    user: {
      id: string;
      role_id: number;
      role_name: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
} 