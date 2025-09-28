"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/AppComponents/AppSidebar";
import { Header } from "@/AppComponents/AppHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "@/providers/index";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pathname = usePathname();

  const toggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsCollapsed((prev) => !prev);
    } else {
      setIsMobileOpen((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => setIsMobileOpen(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Remove attributes added by browser extensions
    if (typeof window !== 'undefined') {
      document.body.removeAttribute('cz-shortcut-listen');
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Routes that should NOT be protected
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Prevent hydration mismatch by showing loading state
  if (!isMounted) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className="bg-background text-gray-100 font-sans" suppressHydrationWarning>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className="bg-background text-gray-100 font-sans" 
        suppressHydrationWarning
      >
        <Toaster position="top-right" richColors closeButton />
        <QueryClientProvider client={queryClient}>
          <Providers>
            {isPublicRoute ? (
              <main className="flex-1 overflow-y-auto">{children}</main>
            ) : (
              <div className="flex h-screen overflow-hidden">
                <Sidebar
                  isCollapsed={isCollapsed}
                  isMobileOpen={isMobileOpen}
                  onCloseMobile={closeMobileSidebar}
                />
                <div className="flex flex-col flex-1">
                  <Header onToggleSidebar={toggleSidebar} />
                  <main className="flex-1 overflow-y-auto p-5 bg-blend-darken">
                    {children}
                  </main>
                </div>
              </div>
            )}
          </Providers>
        </QueryClientProvider>
      </body>
    </html>
  );
}