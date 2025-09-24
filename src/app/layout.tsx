"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/AppComponents/AppSidebar";
import { Header } from "@/AppComponents/AppHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Providers } from "@/providers/index";
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const pathname = usePathname();

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed((prev) => !prev);
    } else {
      setIsMobileOpen((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => setIsMobileOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Routes that should NOT be protected
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className="bg-background text-gray-100 font-sans">

        <QueryClientProvider client={queryClient}>
          <Providers>
            {isPublicRoute ? (
              // Directly render public pages like login
              <main className="flex-1 overflow-y-auto">{children}</main>
            ) : (
              // Wrap protected routes
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
