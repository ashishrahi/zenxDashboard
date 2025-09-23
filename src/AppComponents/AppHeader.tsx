"use client";

import { Menu, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const dispatch = useDispatch();
  const { email } = useSelector((state: RootState) => state.auth);
 const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
     router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-gray-800 shadow-md sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        {/* Sidebar Toggle */}
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

      {/* User Profile Menu */}
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="User Profile"
              className="p-2 rounded-full hover:bg-[#2a2a2a] transition"
            >
              <User className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 bg-[#1a1a1a] text-gray-200 border-gray-800">
            <DropdownMenuLabel className="text-sm">
              {email || "Guest User"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            
            <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-700" />
            
            <DropdownMenuItem
              onClick={handleLogout}
              className="hover:bg-red-600 cursor-pointer text-red-400 focus:text-red-300"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
