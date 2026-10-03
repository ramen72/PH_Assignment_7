import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <RoleGuard roles={["ADMIN", "SUPER_ADMIN"]}>
      {/* biome-ignore lint/a11y/useValidAriaRole: `role` is a component prop, not an ARIA role. */}
      <DashboardShell role="ADMIN">{children}</DashboardShell>
    </RoleGuard>
  );
};

export default Layout;
