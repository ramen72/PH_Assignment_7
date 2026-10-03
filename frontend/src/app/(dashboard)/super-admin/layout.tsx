import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <RoleGuard roles={["SUPER_ADMIN"]}>
      <DashboardShell role="SUPER_ADMIN">{children}</DashboardShell>
    </RoleGuard>
  );
};

export default Layout;
