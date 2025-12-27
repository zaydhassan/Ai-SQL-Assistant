"use client";

import "../app/globals.css";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <html lang="en">
      <body>
      
        <nav className="navbar w-full">
          <div className="relative h-16 w-full">
            <div className="mx-auto flex h-full max-w-7xl items-center px-6">
              {/* LOGO */}
              <div className="flex items-center">
                <Link href="/">
  <span className="logo text-xl font-bold tracking-wide cursor-pointer">
    AI SQL
  </span>
</Link>
              </div>

              <div className="absolute left-1/2 hidden -translate-x-1/2 md:flex items-center gap-10">
                <a href="/overview" className="nav-link">Overview</a>
                <a href="/docs" className="nav-link">Docs</a>
                <a href="/pricing" className="nav-link">Pricing</a>
              </div>

              <div className="ml-auto hidden md:flex items-center gap-8">
                {!isLoggedIn ? (
                  <>
                    <a href="/login" className="nav-link">Login</a>
                    <a href="/register" className="signup-btn">Sign up</a>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="nav-link text-red-400 hover:text-red-500"
                  >
                    Logout
                  </button>
                )}
              </div>

              <button
                className="ml-auto md:hidden text-white text-2xl"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                ☰
              </button>
            </div>
          </div>

          {open && (
            <div className="md:hidden border-t border-white/10 bg-[#050816] px-6 py-6">
              <div className="flex flex-col gap-5">
                <a href="/overview" className="nav-link">Overview</a>
                <a href="/docs" className="nav-link">Docs</a>
                <a href="/pricing" className="nav-link">Pricing</a>

                <div className="mt-4 flex gap-4">
                  {!isLoggedIn ? (
                    <>
                      <a href="/login" className="nav-link">Login</a>
                      <a href="/register" className="signup-btn">Sign up</a>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="nav-link text-red-400"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        <main>{children}</main>

        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}