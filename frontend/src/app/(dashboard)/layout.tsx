import AuthGuard from "@/components/auth/auth-guard";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <AuthGuard>{children}</AuthGuard>
    </div>
  );
};

export default Layout;
