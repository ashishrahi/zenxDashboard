"use client";

import { Menu, User } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-800 shadow-md sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        {/* Sidebar Toggle (Desktop + Mobile) */}
        <button
          type="button"
          aria-label="Toggle Sidebar"
          onClick={onToggleSidebar}
          className="p-2 rounded-md hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-red-600 transition"
        >
          <Menu className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm overflow-x-auto">
          <ol className="flex items-center space-x-2 text-gray-400 whitespace-nowrap">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Application
              </a>
            </li>
            <li className="text-gray-600" aria-hidden="true">
              /
            </li>
            <li className="text-gray-200 font-medium">Data Fetching</li>
          </ol>
        </nav>
      </div>

      {/* User Profile */}
      <div className="flex items-center">
        <button
          type="button"
          aria-label="User Profile"
          className="p-2 rounded-full hover:bg-[#2a2a2a] transition"
        >
          <User className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </div>
    </header>
  );
}
