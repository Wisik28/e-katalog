"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/SideBar";
import authApi from "@/api/authApi";

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // menyimpan tema di localStorage agar preferensi tidak terhapus/berubah ketika menutup dan membuka tab baru
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Auth verification for all /admin routes
    const authed = authApi.isAuthenticated();
    setIsAuthenticated(authed);
    setIsCheckingAuth(false);

    if (pathname === "/admin") {
      // If user is already logged in and visits /admin login page, redirect to dashboard
      if (authed) {
        router.replace("/admin/dashboard");
      }
    } else {
      // If user tries to visit any subroute (e.g. /admin/dashboard, /admin/products/create) without login, redirect to /admin
      if (!authed) {
        router.replace("/admin");
      }
    }
  }, [pathname, router]);

  // If on /admin route (the login page)
  if (pathname === "/admin") {
    if (isCheckingAuth) return null;
    if (isAuthenticated) return null; // Will redirect to /admin/dashboard
    return <>{children}</>;
  }

  // If checking auth or not authenticated on a protected subroute (/admin/*)
  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#C89B3C] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Memeriksa hak akses...</span>
        </div>
      </div>
    );
  }

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main content */}
      <div
        className={`
          flex-1 flex flex-col min-h-screen transition-all duration-300
          ${collapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        <main className="flex-1 p-4 lg:p-6 pt-20 lg:pt-6">{children}</main>
      </div>
    </div>
  );
}
