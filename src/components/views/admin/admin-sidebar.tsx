// src/components/views/admin/admin-sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";

type MenuItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const adminMenu: MenuItem[] = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} /> },
  { name: "Manajemen Toko", href: "/admin/store", icon: <Store size={18} /> },
  {
    name: "Manajemen Produk",
    href: "/admin/products",
    icon: <ShoppingBag size={18} />,
  },
];

export function AdminSidebar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const path = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      if (res.ok) {
        setUser(null);
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat logout:", error);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Gagal mengambil sesi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    if (
      !loading &&
      (!user || user.email !== "stevenjonathanalfredo785@gmail.com")
    ) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) return null;

  return (
    <aside className="w-72 min-h-screen bg-[#050815] border-r border-slate-800/80 flex flex-col justify-between shadow-xl sticky top-0">
      {/* TOP: Profil + Menu */}
      <div>
        {/* Header profile */}
        <div className="px-6 py-5 border-b border-slate-800/80 bg-gradient-to-r from-[#060b1b] via-[#080d20] to-[#060b1b]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-500 flex items-center justify-center font-bold text-white shadow-[0_0_18px_rgba(239,68,68,0.55)]">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-50">Admin Panel</p>
              <p className="text-xs text-slate-400">{user?.email || "Admin"}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="px-3 pt-4 pb-4 text-sm space-y-1">
          <p className="px-3 mb-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
            Menu Admin
          </p>

          {adminMenu.map((m) => {
            const active = path === m.href;
            return (
              <Link
                key={m.name}
                href={m.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition 
                  ${
                    active
                      ? "bg-red-500 text-white font-semibold shadow-[0_0_18px_rgba(239,68,68,0.35)]"
                      : "text-slate-400 hover:text-slate-50 hover:bg-slate-800/60"
                  }`}
              >
                <span
                  className={`w-1.5 h-7 rounded-full ${
                    active ? "bg-white/20" : "bg-slate-700/40"
                  }`}
                />
                <span className="flex items-center gap-2">
                  {m.icon}
                  {m.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM: Logout + copyright */}
      <div className="px-4 pb-5 pt-3 border-t border-slate-800/80 bg-[#050815] space-y-3">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200
                     hover:border-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>

        <p className="text-[11px] text-slate-500 text-center">
          © 2025 OnlineMarket
        </p>
      </div>
    </aside>
  );
}
