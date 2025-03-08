"use client";

import Navbar from "@/components/navigation/Navbar";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Skip the layout for authentication pages and landing page
  if (pathname === "/" || pathname.startsWith("/auth")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 