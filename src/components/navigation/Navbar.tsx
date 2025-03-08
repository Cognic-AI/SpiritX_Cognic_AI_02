"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

// Admin role ID for identification
const ADMIN_ROLE_ID = 1;

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if current user is admin
  const isAdmin = session?.user?.role_id === ADMIN_ROLE_ID;
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute = !isAdminRoute && pathname !== "/" && !pathname.startsWith("/auth");

  // Set navigation items based on the route type
  const navItems = isAdminRoute
    ? [
        { name: "Dashboard", href: "/admin" },
        { name: "Players", href: "/admin/players" },
        { name: "Player Stats", href: "/admin/player-stats" },
        { name: "Tournament Summary", href: "/admin/tournament-summary" },
      ]
    : isUserRoute
    ? [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Players", href: "/players" },
        { name: "Select Team", href: "/select-team" },
        { name: "My Team", href: "/team" },
        { name: "Budget", href: "/budget" },
        { name: "Leaderboard", href: "/leaderboard" },
        { name: "Spiriter", href: "/spiriter" },
      ]
    : [];

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href={session ? (isAdminRoute ? "/admin" : "/dashboard") : "/"} 
              className="flex-shrink-0 flex items-center"
            >
              <span className="text-xl font-bold">Spirit11</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? "bg-indigo-800 text-white"
                    : "text-white hover:bg-indigo-700"
                } px-3 py-2 rounded-md text-sm font-medium`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">{session.user?.name || session.user?.id || "User"}</span>
                
                {/* Admin Dashboard Button - Only visible to admin users and when not on admin routes */}
                {isAdmin && !isAdminRoute && (
                  <Link
                    href="/admin"
                    className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                {/* User Dashboard Button - Only visible to admin users when on admin routes */}
                {isAdmin && isAdminRoute && (
                  <Link
                    href="/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    User Dashboard
                  </Link>
                )}
                
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              pathname !== "/auth/login" && pathname !== "/auth/register" && (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-white text-indigo-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-indigo-700 pb-3 pt-2">
          <div className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? "bg-indigo-800 text-white"
                    : "text-white hover:bg-indigo-700"
                } block px-3 py-2 rounded-md text-base font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Dashboard Button for mobile - Only visible to admin users when not on admin routes */}
            {isAdmin && !isAdminRoute && (
              <Link
                href="/admin"
                className="block px-3 py-2 bg-green-600 text-white rounded-md text-base font-medium mt-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            {/* User Dashboard Button for mobile - Only visible to admin users when on admin routes */}
            {isAdmin && isAdminRoute && (
              <Link
                href="/dashboard"
                className="block px-3 py-2 bg-blue-600 text-white rounded-md text-base font-medium mt-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                User Dashboard
              </Link>
            )}
            
            {session ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="bg-indigo-800 hover:bg-indigo-900 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium mt-4"
              >
                Sign Out
              </button>
            ) : (
              <div className="pt-4 pb-3 border-t border-indigo-800">
                <div className="space-y-1 px-2">
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-indigo-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 