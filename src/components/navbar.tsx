"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function Navbar() {

  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session" , {
        method: "GET",
        credentials: "include"
      });
      console.log(res)
      const data = await res.json();
      setIsLogin(data.loggedIn);
      setUser(data.user);
    }

    fetchSession();
  }, []);

  console.log(user)

  return (
    <nav className="w-full sticky top-0 z-50 border-b backdrop-blur-xl bg-slate-950/80">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-xl font-bold text-white">MyStore</span>
          </Link>

          {/* Products Menu */}
          <Link
            href="/products"
            className="text-slate-300 hover:text-white transition font-medium hidden md:block"
          >
            Products
          </Link>
        </div>

        {/* MIDDLE: Search bar */}
        <div className="flex-1 px-10 hidden md:block">
          <div className="w-full max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Cari Produk"
              className="w-full px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>

        {/* RIGHT: Auth Buttons / User Menu */}
        {!isLogin ? (
          <div className="flex gap-3">
            <Link href="/login" className="px-5 py-2 border border-slate-600/60 text-slate-200 rounded-xl">
              Login
            </Link>
            <Link href="/register" className="px-5 py-2 text-white bg-orange-600 rounded-xl">
              Register
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setOpenMenu(prev => !prev)}
              className="px-5 py-2.5 bg-slate-800 text-white rounded-xl"
            >
              {user?.name || "Profile"}
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-slate-700 rounded-xl transition">
                <Link href="/store" className="block px-4 py-2 hover:bg-slate-800">Toko Anda</Link>
                <Link href="/profile" className="block px-4 py-2 hover:bg-slate-800">Profile</Link>
                <Link href="/logout" className="block px-4 py-2 hover:bg-slate-800">Logout</Link>
              </div>
            )}
          </div>
            )}
      </div>
    </nav>
  )
}
