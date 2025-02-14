// TODO: figure out the user situation

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = Cookies.get("sidebar-collapsed");
    return saved === "true";
  });

  useEffect(() => {
    Cookies.set("sidebar-collapsed", String(isCollapsed), { expires: 365 });
  }, [isCollapsed]);

  return (
    <div className="flex h-screen">
      <SidebarProvider
        defaultOpen={!isCollapsed}
        onOpenChange={(open) => setIsCollapsed(!open)}
      >
        <AppSidebar user={null} />
        <SidebarInset className="flex-1">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </div>
  );
}
