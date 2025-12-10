// src/components/views/auth/login-page.tsx

"use client"

import SecurityIllustration from "./login-illustration"
import LoginForm from "./login-form"
import Link from "next/link"
import { Home } from "lucide-react"

export default function LoginViews() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Tombol Kembali ke Beranda */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 transition-all text-sm font-medium"
        >
          <Home size={18} />
          <span>Beranda</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-cyan-900/50 backdrop-blur-sm flex">
          {/* Left Side - Illustration Section (Dark Theme Gradient) */}
          <div className="w-1/2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-12 flex flex-col items-center justify-center">
            <div className="w-full">
              <h2 className="text-2xl font-bold text-white mb-1">Selamat Datang</h2>
              <p className="text-slate-400 text-sm mb-8">Masuk ke Akun Anda</p>
              <SecurityIllustration />
            </div>
          </div>

          {/* Right Side - Form Section (Dark Blue Background) */}
          <div className="w-1/2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 p-12 flex items-center justify-center">
            <div className="w-full">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}