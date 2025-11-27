"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import LoginIllustration from "../../../components/login-illustration"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-cyan-900/50 backdrop-blur-sm flex">
          {/* Left Side - Illustration Section (Dark Theme Gradient) */}
          <div
            className={`w-1/2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-12 flex flex-col items-center justify-center transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
            }`}
          >
            <div className="w-full">
              <h2 className="text-2xl font-bold text-white mb-1">Selamat Datang</h2>
              <p className="text-slate-400 text-sm mb-8">Masuk ke Toko Anda</p>
              <LoginIllustration />
            </div>
          </div>

          {/* Right Side - Form Section (Dark Blue Background) */}
          <div
            className={`w-1/2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 p-12 flex items-center justify-center transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
            }`}
          >
            <div className="w-full">
              <h1 className="text-3xl font-bold text-white mb-2">Masuk ke Akun</h1>
              <p className="text-blue-100 text-sm mb-8">Akses akun MyStore untuk mulai berjualan atau berbelanja</p>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">KATA SANDI</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded bg-white/20 border border-white/30 cursor-pointer accent-orange-400"
                    />
                    <span className="text-sm text-white/80">Ingat saya</span>
                  </label>
                  <a href="#" className="text-sm text-white/70 hover:text-white transition">
                    Lupa kata sandi?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition duration-200 text-center tracking-wide mt-8"
                >
                  LOGIN SEKARANG
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-blue-700 text-white/70">atau</span>
                  </div>
                </div>

                {/* Sign Up Links */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-white/80">
                    Belum punya akun?{" "}
                    <a href="/register" className="text-orange-300 hover:text-orange-200 font-semibold transition">
                      Daftar sebagai User
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
