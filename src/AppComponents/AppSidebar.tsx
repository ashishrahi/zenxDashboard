"use client";

import { ChevronDown, Search, X, Users, BoxesIcon } from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import Link from "next/link";
import clsx from "clsx";
import { useState } from "react";
import { useRouter } from "next/navigation";
interface SidebarProps {
  isCollapsed: boolean;       // Desktop
  isMobileOpen: boolean;      // Mobile
  onCloseMobile: () => void;  // Mobile close
}

export function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile }: SidebarProps) {
    const router = useRouter();

  const handleNavigate = () => {
    router.push("/dashboard"); // navigates to /dashboard
  };
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden",
          isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onCloseMobile}
      />

      <aside
        className={clsx(
          "fixed lg:relative transition-all duration-300 bg-[#1a1a1a] h-screen flex flex-col shadow-lg border-r border-gray-800 z-50",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Logo / Top */}
        <div className="flex items-center justify-center p-4 border-b border-gray-800 relative">
          {!isCollapsed && (
            <h1
      className="font-bold text-xl text-red-600 tracking-wide cursor-pointer"
      onClick={handleNavigate}
    >
      Genric
    </h1>
          )}

          {/* Close button for mobile */}
          <button
            className="lg:hidden absolute right-2 top-2 p-1 hover:bg-[#2a2a2a] rounded"
            onClick={onCloseMobile}
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-3">
            <div className="flex items-center bg-[#2a2a2a] rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-red-600">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm flex-1 outline-none placeholder-gray-500 text-gray-200"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto mt-2">
          <SidebarSection
            title="MASTERS"
            icon={<Users className="w-4 h-4" />}
            isCollapsed={isCollapsed}
            items={[
              { name: "Country", href: "/countries" },
              { name: "State", href: "/states" },
              { name: "City", href: "/cities" },
              { name: "Faq", href: "/faqs" },
              { name: "Blog", href: "/blogs" },
              { name: "Export", href: "/exports" },
              { name: "History", href: "/histories" },
            ]}
          />

          <SidebarSection
            title="USERS"
            icon={<Users className="w-4 h-4" />}
            isCollapsed={isCollapsed}
            items={[
              { name: "User", href: "/users" },
              // { name: "Active User", href: "/users" },
            ]}
          />

          <SidebarSection
            title="BANNERS"
            icon={<BoxesIcon className="w-4 h-4" />}
            isCollapsed={isCollapsed}
            items={[
              { name: "Banners", href: "/banners" },
              // { name: "Active", href: "/active" },
            ]}
          />

          <SidebarSection
            title="CATEGORY"
            icon={<BoxesIcon className="w-4 h-4" />}
            isCollapsed={isCollapsed}
            items={[
              { name: "Categories", href: "/categories" },
              // { name: "Active", href: "/active" },
            ]}
          />

          <SidebarSection
            title="SUB CATEGORY"
            icon={<BoxesIcon className="w-4 h-4" />}
            isCollapsed={isCollapsed}
            items={[
              { name: "Subcategory", href: "/subcategories" },
              // { name: "Active", href: "/active" },
            ]}
          />

          <SidebarSection
            title="PRODUCTS"
            icon={<BoxesIcon className="w-4 h-4" />}
            isCollapsed={isCollapsed}
            items={[
              { name: "Products", href: "/products" },
              // { name: "Active", href: "/active" },
            ]}
          />

          
          <SidebarSection
            title="ORDERS"
            icon={<BoxesIcon className="w-4 h-4" />}
            isCollapsed={isCollapsed}
            items={[
              { name: "Orders", href: "/orders" },
              // { name: "Active", href: "/active" },
            ]}
          />

           <SidebarSection
            title="CONTACTS"
            icon={<BoxesIcon className="w-4 h-4" />}
            isCollapsed={isCollapsed}
            items={[
              { name: "Contacts", href: "/contacts" },
              // { name: "Active", href: "/active" },
            ]}
          />

           <SidebarSection
            title="EXPORTS"
            icon={<BoxesIcon className="w-4 h-4" />}
            isCollapsed={isCollapsed}
            items={[
              { name: "Export", href: "/exports" },
              // { name: "Active", href: "/active" },
            ]}
          />
             <SidebarSection
            title="ENQUIRE"
            icon={<BoxesIcon className="w-4 h-4" />}
            isCollapsed={isCollapsed}
            items={[
              { name: "Equire", href: "/enquire" },
              // { name: "Active", href: "/active" },
            ]}
          />
        </nav>
      </aside>
    </>
  );
}

function SidebarSection({
  title,
  icon,
  items,
  isCollapsed,
}: {
  title: string;
  icon: React.ReactNode;
  items: { name: string; href: string }[];
  isCollapsed: boolean;
}) {
  const [open, setOpen] = useState(false); // collapsed by default

  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger asChild>
          <button
            className={clsx(
              "flex items-center w-full px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            <div className="flex items-center">
              {icon}
              {!isCollapsed && <span className="ml-2">{title}</span>}
            </div>
            {!isCollapsed && (
              <ChevronDown
                className={clsx(
                  "w-4 h-4 transition-transform",
                  open ? "rotate-0" : "-rotate-90"
                )}
              />
            )}
          </button>
        </Collapsible.Trigger>

        <Collapsible.Content>
          <div className="space-y-1 pb-2">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "block py-1 text-sm text-gray-300 rounded hover:bg-[#2a2a2a] hover:text-white transition-colors",
                  isCollapsed ? "text-center px-0" : "px-10"
                )}
              >
                {isCollapsed ? "•" : item.name}
              </Link>
            ))}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
