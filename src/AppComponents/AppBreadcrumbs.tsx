"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  LayoutDashboard,
  ChevronRight
} from "lucide-react";

const breadcrumbConfig: Record<string, { name: string; icon: React.ReactNode }> = {
  dashboard: { 
    name: "Dashboard", 
    icon: <LayoutDashboard className="h-4 w-4" /> 
  },
  users: { 
    name: "Users", 
    icon: <Users className="h-4 w-4" /> 
  },
  products: { 
    name: "Products", 
    icon: <Package className="h-4 w-4" /> 
  },
  orders: { 
    name: "Orders", 
    icon: <ShoppingCart className="h-4 w-4" /> 
  },
};

const DefaultIcon = <Package className="h-4 w-4" />;

export function AppBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <div className="breadcrumb-container hover:opacity-100 hover:visible">
      <Breadcrumb>
        <BreadcrumbList>
          {/* Home Breadcrumb */}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:no-underline">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {segments.map((segment, index) => {
            const path = "/" + segments.slice(0, index + 1).join("/");
            const isLast = index === segments.length - 1;
            const config = breadcrumbConfig[segment];
            const displayName = config?.name || segment.charAt(0).toUpperCase() + segment.slice(1);
            const icon = config?.icon || DefaultIcon;

            return (
              <div key={index} className="flex items-center">
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4 text-red-500" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {isLast ? (
                    <span className="flex items-center gap-2 text-red-500 font-medium">
                      {icon}
                      <span>{displayName}</span>
                    </span>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={path} className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:no-underline">
                        {icon}
                        <span>{displayName}</span>
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}