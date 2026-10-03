"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import type { UserRole } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const routes = [
    { id: 1, name: "Home", url: "/" },
    {
      id: 2,
      title: "Features",
      url: "/features",
    },
    { id: 3, name: "About Us", url: "/about-us" },
    { id: 4, name: "Contact", url: "/contact" },
  ];

  const dashboardRoute: Record<UserRole, string> = {
    SUPER_ADMIN: "/super-admin",
    ADMIN: "/admin",
    MANAGER: "/manager",
    EMPLOYEE: "/dashboard",
  };

  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();

  const role: UserRole = !!data?.data && data?.data.role;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (res) => {
        toast.add({
          title: "Logged out",
          description: res.message,
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["user"] });
        router.replace("/");
      },
      onError: (error) => {
        toast.add({
          title: "Logged out Failed",
          description: error.message,
          type: "error",
        });
      },
    });
  };

  return (
    <header className="w-full h-16 border border-b">
      <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-1">
          {/* <Logo /> */}
          <Image
            src="/logo.png"
            alt="Logo"
            width={60}
            height={60}
          />
        </Link>

        <nav className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.url} href={route.url}>
              {route.name}
            </Link>
          ))}

          {role && <Link href={dashboardRoute[role]}>Dashboard</Link>}
        </nav>
        <div>
          {!isLoading && !data && (
            <Button
              variant="outline"
              render={<Link href="/login">Login</Link>}
              nativeButton={false}
            >
              Login
            </Button>
          )}
          {!isLoading && data && (
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
