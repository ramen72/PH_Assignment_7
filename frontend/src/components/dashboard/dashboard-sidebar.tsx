"use client";

import Logo from "@/assets/svg/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import type { UserRole } from "@/types";
import { adminRoutes, employeeRoutes, managerRoutes, } from "@/routes";
import type { SidebarItems } from "@/types/sidebar.type";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { superAdminRoutes } from "@/routes/superAdmin.routes";

const sidebarRoutes: Partial<Record<UserRole, SidebarItems>> = {
  SUPER_ADMIN: superAdminRoutes,
  ADMIN: adminRoutes,
  MANAGER: managerRoutes,
  EMPLOYEE: employeeRoutes,
};

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const routes: SidebarItems = sidebarRoutes[role] || [];

  console.log(pathname);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <div className="flex items-center gap-2">
            <Logo />
            <span>NovoSoft</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {routes.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={pathname === item.url}
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
