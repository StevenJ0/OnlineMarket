"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type MenuItem = {
  name: string;
  href: string;
};

const menu: MenuItem[] = [
  { name: "Dashboard", href: "/penjual/dashboard" },
  { name: "Kelola Produk", href: "/penjual/product" },
  { name: "Laporan", href: "/penjual/report" },
  { name: "View Rating", href: "/penjual/reting" },
];



export function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  console.log(user);

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
      } else {
        console.error("Gagal logout");
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

          if (!res.ok) {
            throw new Error("Network response was not ok");
          }

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
      if (!loading && user === null || user === undefined) {
        router.push("/login");
      }
    }, [loading, user, router]);

    if (loading) return null;

  return (
    <aside className="w-72 min-h-screen bg-[#050815] border-r border-slate-800/80 flex flex-col justify-between shadow-xl">
      {/* TOP: Profil + Menu */}
      <div>
        {/* Header profile */}
        <div className="px-6 py-5 border-b border-slate-800/80 bg-gradient-to-r from-[#060b1b] via-[#080d20] to-[#060b1b]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#ff7a1a] flex items-center justify-center font-bold text-slate-900 shadow-[0_0_18px_rgba(255,122,26,0.55)]">
              {user && user.email ? user.email.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-50 ">Dashboard Penjual</p>
              <p className="text-xs text-slate-400">{user && user.email ? user.email : "User"}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="px-3 pt-4 pb-4 text-sm space-y-1">
          <p className="px-3 mb-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
            Menu Utama
          </p>

          {menu.map((m) => {
            const active = path === m.href;

            return (
              <Link
                key={m.name}
                href={m.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition 
                  ${
                    active
                      ? "bg-[#ff7a1a] text-black font-semibold shadow-[0_0_18px_rgba(255,122,26,0.35)]"
                      : "text-slate-400 hover:text-slate-50 hover:bg-slate-800/60"
                  }`}
              >
                <span
                  className={`w-1.5 h-7 rounded-full ${
                    active ? "bg-black/40" : "bg-slate-700/40"
                  }`}
                />
                <span>{m.name}</span>
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
          <span className="text-xs">⏻</span>
          <span>Logout</span>
        </button>

        <p className="text-[11px] text-slate-500 text-center">
          © 2025 MyStore
        </p>
      </div>
    </aside>
  );
}
