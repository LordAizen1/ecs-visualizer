"use client";

import { usePathname } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children, defaultOpen }: { children: React.ReactNode, defaultOpen: boolean }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen} className="py-2">
        <AppSidebar />
        <main className="w-full">
          <Navbar />
          <div className="px-4">
            {children}
          </div>
        </main>
    </SidebarProvider>
  );
}
