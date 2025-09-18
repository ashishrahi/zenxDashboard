"use client";
import "./globals.css";
import { useState, useEffect } from "react";
import { Sidebar } from "@/AppComponents/AppSidebar";
import { Header } from "@/AppComponents/AppHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Mobile sidebar

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      // Desktop
      setIsCollapsed((prev) => !prev);
    } else {
      // Mobile
      setIsMobileOpen((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => setIsMobileOpen(false);

  // Optional: Close mobile sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <html lang="en">
      <body className="bg-[#0f0f0f] text-gray-100 font-sans">
        <div className="flex h-screen overflow-hidden">
           <QueryClientProvider client={queryClient}>
          {/* Sidebar */}
          <Sidebar
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
            onCloseMobile={closeMobileSidebar}
          />

          {/* Main Content */}
          <div className="flex flex-col flex-1">
            <Header onToggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-y-auto p-1 bg-blend-darken">
              {children}
            </main>
          
          </div>
          </QueryClientProvider>
        </div>

      </body>
    </html>
  );
}
