"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import SecurityIllustration from "./login-illustration"
import FormFillingIllustration from "./register-illustration"

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Register state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", loginData)
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Register attempt:", registerData)
  }

  const handleToggleMode = (mode: boolean) => {
    setIsLogin(mode)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-cyan-900/50 backdrop-blur-sm">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: isLogin ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            {/* LOGIN VIEW */}
            <div className="flex w-full flex-shrink-0">
              {/* Illustration Section */}
              <div className="w-1/2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-12 flex flex-col items-center justify-center">
                <div className="w-full">
                  <h2 className="text-2xl font-bold text-white mb-1">Selamat Datang</h2>
                  <p className="text-slate-400 text-sm mb-8">Masuk ke Toko Anda</p>
                  <SecurityIllustration />
                </div>
              </div>

              {/* Form Section */}
              <div className="w-1/2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 p-12 flex items-center justify-center">
                <div className="w-full">
                  <h1 className="text-3xl font-bold text-white mb-2">Masuk ke Akun</h1>
                  <p className="text-blue-100 text-sm mb-8">Akses akun MyStore untuk mulai berjualan atau berbelanja</p>

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">
                        EMAIL ADDRESS
                      </label>
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
                      <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">
                        KATA SANDI
                      </label>
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
                        <button
                          onClick={() => handleToggleMode(false)}
                          className="text-orange-300 hover:text-orange-200 font-semibold transition"
                        >
                          Daftar sebagai User
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* REGISTER VIEW */}
            <div className="flex w-full flex-shrink-0">
              {/* Form Section - LEFT */}
              <div className="w-1/2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 p-12 flex items-center justify-center">
                <div className="w-full">
                  <h1 className="text-3xl font-bold text-white mb-2">Buat Akun Baru</h1>
                  <p className="text-blue-100 text-sm mb-8">
                    Bergabunglah dengan MyStore untuk mulai berjualan atau berbelanja
                  </p>

                  <form onSubmit={handleRegisterSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div>
                      <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">
                        NAMA LENGKAP
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={registerData.name}
                        onChange={handleRegisterChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition"
                      />
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">
                        KATA SANDI
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
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

                    {/* Confirm Password Field */}
                    <div>
                      <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">
                        KONFIRMASI KATA SANDI
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={registerData.agreeTerms}
                        onChange={handleRegisterChange}
                        className="w-4 h-4 rounded bg-white/20 border border-white/30 cursor-pointer accent-orange-400 mt-1"
                      />
                      <span className="text-sm text-white/80">
                        Saya setuju dengan{" "}
                        <a href="#" className="text-orange-300 hover:text-orange-200 font-semibold">
                          Syarat dan Ketentuan
                        </a>
                      </span>
                    </label>

                    {/* Register Button */}
                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition duration-200 text-center tracking-wide mt-8"
                    >
                      DAFTAR SEKARANG
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

                    {/* Sign In Link */}
                    <div className="text-center">
                      <p className="text-sm text-white/80">
                        Sudah punya akun?{" "}
                        <button
                          onClick={() => handleToggleMode(true)}
                          className="text-orange-300 hover:text-orange-200 font-semibold transition"
                        >
                          Masuk di sini
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* Illustration Section - RIGHT */}
              <div className="w-1/2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-12 flex flex-col items-center justify-center">
                <div className="w-full">
                  <h2 className="text-2xl font-bold text-white mb-1">Bergabunglah</h2>
                  <p className="text-slate-400 text-sm mb-8">Daftar akun baru Anda</p>
                  <FormFillingIllustration />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
