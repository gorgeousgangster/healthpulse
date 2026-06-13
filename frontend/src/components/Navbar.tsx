"use client";

import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">HP</span>
          </div>
          <span className="text-xl font-bold text-gray-900">HealthPulse</span>
        </a>

        <div className="flex items-center gap-6">
          <a href="/" className="text-gray-600 hover:text-primary-600 font-medium">Home</a>

          {status === "authenticated" ? (
            <>
              <a href="/assess" className="text-gray-600 hover:text-primary-600 font-medium">Assess Risk</a>
              <a href="/dashboard" className="text-gray-600 hover:text-primary-600 font-medium">Dashboard</a>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-gray-500">{session.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-gray-500 hover:text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <a href="/login" className="text-gray-600 hover:text-primary-600 font-medium">Sign In</a>
              <a
                href="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Get Started
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
