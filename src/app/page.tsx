import React from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/AppComponents/AppSectionCard";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarInset>
        <div className="flex flex-1 flex-col overflow-x-hidden"> 
          {/* Added overflow-x-hidden here */}
          <div className="@container/main flex flex-1 flex-col gap-2 overflow-x-hidden">
            {/* Added overflow-x-hidden here too */}
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 overflow-x-hidden">
              {/* Section Cards Component */}
              <SectionCards />

              {/* Chart Area */}
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>

              {/* Uncomment when DataTable is ready */}
              {/* <DataTable data={data} /> */}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
