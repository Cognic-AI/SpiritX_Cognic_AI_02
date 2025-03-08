"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// In a real app, you'd have a proper role-based system
// For this demo, we'll consider a specific username as admin
const ADMIN_USERNAME = "admin";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading, don't do anything yet

    // If user is not logged in or not an admin, redirect
    if (!session) {
      router.push("/auth/login?callbackUrl=/admin");
    } else if (session.user?.id !== ADMIN_USERNAME) {
      router.push("/dashboard"); // Redirect non-admin users to dashboard
    }
  }, [session, status, router]);

  // Show loading or authorized content
  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return session && session.user?.id === ADMIN_USERNAME ? (
    <>{children}</>
  ) : null;
} 