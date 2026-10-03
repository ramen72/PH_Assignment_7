import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import type { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["EMPLOYEE", "SUPER_ADMIN"]}>
      {/* biome-ignore lint/a11y/useValidAriaRole: `role` is a component prop, not an ARIA role. */}
      <DashboardShell role="EMPLOYEE">{children}</DashboardShell>
    </RoleGuard>
  );
}
