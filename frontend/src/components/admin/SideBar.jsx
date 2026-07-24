"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import authApi from "@/api/authApi";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 10a2 2 0 012-2h3a2 2 0 012 2v.5a2 2 0 01-2 2H5a2 2 0 01-2-2V17zm11-10a2 2 0 012-2h.5a2 2 0 012 2v3a2 2 0 01-2 2H16a2 2 0 01-2-2V7zm0 10a2 2 0 012-2h.5a2 2 0 012 2v.5a2 2 0 01-2 2H16a2 2 0 01-2-2V17z" />
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Produk",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ collapsed, setCollapsed, isDark, toggleTheme }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({ email: "" });

  useEffect(() => {
    setUserInfo({
      email: authApi.getEmail() || "Administrator",

    });
  }, []);

  const handleLogout = () => {
    // Hapus token/session dan redirect ke login
    authApi.logout();
    router.push("/admin");
  };

  return (
    <>
      {/* Floating mobile toggle button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="lg:hidden fixed top-4 left-4 z-40 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-950 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-white/10 shadow-lg transition-colors animate-fade-in"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/5
          transition-all duration-300 ease-in-out
          ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"}
        `}
      >
        {/* Logo */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-5 py-5 border-b border-slate-200 dark:border-white/5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg shadow-purple-500/10">
            <Image
              src="/logo_vivien_store.png"
              alt="Logo Vivien's Store"
              fill
              className="object-cover"
            />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-slate-900 dark:text-white font-bold text-sm leading-none">Vivien's Store</p>
              <p className="text-slate-500 text-xs mt-0.5">Admin Panel</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCollapsed(true);
              }}
              className="ml-auto hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className={`text-slate-400 dark:text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 mb-3 ${collapsed ? "hidden" : ""}`}>Menu</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : ""}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive
                    ? "bg-purple-50 dark:bg-gradient-to-r dark:from-purple-500/20 dark:to-pink-500/10 text-purple-600 dark:text-purple-300 border border-purple-100 dark:border-purple-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"}
                `}
              >
                <span className={`flex-shrink-0 ${isActive ? "text-purple-600 dark:text-purple-400" : ""}`}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Notification & Theme Toggle) */}
        <div className={`px-3 py-3 border-t border-slate-200 dark:border-white/5 flex ${collapsed ? "flex-col gap-3 items-center" : "items-center justify-around"}`}>
          {/* Notification Bell */}
          <button 
            className="relative w-9 h-9 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
            title="Notifikasi"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center transition-colors"
            title={isDark ? "Mode Terang" : "Mode Gelap"}
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        {/* User & logout */}
        <div className="px-3 py-4 border-t border-slate-200 dark:border-white/5">
          <div className={`flex items-center gap-3 px-3 py-2 mb-2 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-slate-900 dark:text-white text-sm font-medium truncate">Admin</p>
                <p className="text-slate-500 text-xs truncate">{userInfo.email}</p>                
              </div>
            )}
          </div>
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            title={collapsed ? "Keluar" : ""}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 
              text-sm font-medium transition-all duration-150
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
