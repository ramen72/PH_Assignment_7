import DashboardShell from "@/components/dashboard/dashboard-shell";
import RoleGuard from "@/components/auth/role-guard";
import type { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["MANAGER", "SUPER_ADMIN"]}>
      {/* biome-ignore lint/a11y/useValidAriaRole: `role` is a component prop, not an ARIA role. */}
      <DashboardShell role="MANAGER">{children}</DashboardShell>
    </RoleGuard>
  );
}
