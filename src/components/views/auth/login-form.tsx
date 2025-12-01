"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  console.log("jalan")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })


  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = {
      email: loginData.email,
      password: loginData.password,
      rememberMe,
    };

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Login failed.");
      return;
    }

    window.location.href = "/dashboard";

  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-white mb-2">Masuk ke Akun</h1>
      <p className="text-blue-100 text-sm mb-8">Akses akun MyStore untuk mulai berjualan atau berbelanja</p>

      <form onSubmit={handleLoginSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
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
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
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
              onClick={() => setRememberMe(!rememberMe)}
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
            <span className="px-2 bg-slate-800 text-white/70">atau</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-white/80">
            Belum punya akun?{" "}
            <Link href="/register" className="text-orange-300 hover:text-orange-200 font-semibold transition">
              Daftar sebagai User
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
