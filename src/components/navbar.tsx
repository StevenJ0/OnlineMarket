// src/components/navbar.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Store,
  User,
  LogOut,
  ShoppingBag,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith("/penjual") || pathname.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setIsLogin(data.loggedIn);
        setUser(data.user);
        
        // ← CEK APAKAH ADMIN
        const adminEmail = "stevenjonathanalfredo785@gmail.com";
        setIsAdmin(data.loggedIn && data.user?.email === adminEmail);
      } catch (error) {
        console.error("Gagal mengambil sesi:", error);
      }
    }
    fetchSession();
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // --- FUNGSI LOGOUT ---
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (res.ok) {
        // Reset state lokal
        setIsLogin(false);
        setUser(null);
        setIsAdmin(false);
        setOpenProfileMenu(false);
        closeMobileMenu();

        // Redirect ke halaman login dengan hard refresh
        window.location.href = "/login";
      } else {
        console.error("Gagal logout");
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat logout:", error);
    }
  };

  return (
    <nav className="w-full sticky top-0 z-50 border-b border-slate-800 backdrop-blur-xl bg-slate-950/80">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={closeMobileMenu}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
              <ShoppingBag size={18} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Tokopaedi
            </span>
          </Link>
        </div>

        <div className="flex-1 px-8 hidden md:block">
          <div className="w-full max-w-xl mx-auto relative group">
            <div className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-orange-500 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Cari Produk di Tokopaedi..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 text-slate-200 border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isLogin ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/buka-toko"
                className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl hover:shadow-lg hover:shadow-orange-600/20 transition-all hover:scale-105 active:scale-95"
              >
                Daftar Toko
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpenProfileMenu((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-600 text-white rounded-xl transition-all"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isAdmin
                      ? "bg-red-500"
                      : "bg-indigo-600"
                  }`}
                >
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate">
                  {user?.name || "User"}
                </span>
              </button>

              {openProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-800">
                    <p className="text-sm text-white font-semibold truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>
                    {isAdmin && (
                      <p className="text-xs text-red-400 font-semibold mt-1">
                        👑 Admin
                      </p>
                    )}
                  </div>

                  {/* ← MENU BERBEDA BERDASARKAN ROLE */}
                  {isAdmin ? (
                    // MENU ADMIN
                    <>
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                      <Link
                        href="/penjual/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <Store size={16} /> Toko Saya
                      </Link>
                    </>
                  ) : (
                    // MENU SELLER BIASA
                    <Link
                      href="/penjual/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Store size={16} /> Toko Saya
                    </Link>
                  )}

                  <div className="border-t border-slate-800 mt-1">
                    {/* BUTTON LOGOUT (DESKTOP) */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 animate-in slide-in-from-top-5 duration-200 absolute w-full left-0 top-full shadow-2xl">
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-slate-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari produk..."
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Link
                href="/buka-toko"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-600/10 to-orange-500/10 text-orange-400 font-semibold border border-orange-500/20"
              >
                <Store size={18} /> Buka Toko
              </Link>
            </div>

            <hr className="border-slate-800" />

            {!isLogin ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex justify-center py-2.5 border border-slate-700 rounded-xl text-slate-300 font-medium"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="flex justify-center py-2.5 bg-orange-600 rounded-xl text-white font-bold"
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="px-2 py-2 mb-2">
                  <p className="text-sm font-semibold text-white">
                    Halo, {user?.name}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                  {isAdmin && (
                    <p className="text-xs text-red-400 font-semibold mt-1">
                      👑 Admin
                    </p>
                  )}
                </div>

                {/* ← MENU MOBILE BERBEDA BERDASARKAN ROLE */}
                {isAdmin ? (
                  // MENU ADMIN MOBILE
                  <>
                    <Link
                      href="/admin"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-900 rounded-xl"
                    >
                      <LayoutDashboard size={18} /> Admin Dashboard
                    </Link>
                    <Link
                      href="/penjual/dashboard"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-900 rounded-xl"
                    >
                      <Store size={18} /> Toko Saya
                    </Link>
                  </>
                ) : (
                  // MENU SELLER MOBILE
                  <Link
                    href="/penjual/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-900 rounded-xl"
                  >
                    <Store size={18} /> Toko Saya
                  </Link>
                )}

                {/* BUTTON LOGOUT (MOBILE) */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-900 rounded-xl text-left"
                >
                  <LogOut size={18} /> Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}