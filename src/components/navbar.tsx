"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="w-full sticky top-0 z-50 border-b border-slate-800/30 backdrop-blur-xl bg-gradient-to-b from-slate-950/95 to-slate-950/80 shadow-lg shadow-slate-950/20">
      <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-600/30 group-hover:shadow-orange-600/50 transition-all duration-300">
            <span className="text-white font-black text-lg">B</span>
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent hidden sm:inline">
            MyStore
          </span>
        </Link>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3 items-center">
          {/* Login Button - Outline */}
          <Link
            href="/login"
            className="px-4 sm:px-6 py-2.5 text-sm font-semibold border border-slate-600/60 text-slate-200 rounded-xl transition-all duration-300 hover:border-orange-500/80 hover:text-orange-400 hover:bg-orange-500/5 active:scale-95 backdrop-blur-sm"
          >
            Login
          </Link>

          {/* Buka Toko Button - Solid */}
          <Link
            href="/register"
            className="px-4 sm:px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl transition-all duration-300 hover:from-orange-700 hover:to-orange-600 shadow-lg shadow-orange-600/40 hover:shadow-orange-600/60 hover:scale-105 active:scale-95"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  )
}
