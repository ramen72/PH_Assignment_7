import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";
import type { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
