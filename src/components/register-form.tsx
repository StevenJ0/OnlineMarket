"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      alert("Password dan konfirmasi tidak sama!");
      return;
    }

    if (!registerData.agreeTerms) {
      alert("Anda harus menyetujui Syarat dan Ketentuan.");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (!response.ok) {
        switch (response.status) {
          case 400:
            alert(result.error || "Data tidak lengkap.");
            break;

          case 401:
            alert(result.error || "Password tidak valid.");
            break;

          case 409:
            alert("Email sudah terdaftar.");
            break;

          case 500:
            alert("Terjadi kesalahan server.");
            break;

          default:
            alert("Terjadi kesalahan.");
        }
        return;
      }

      alert("Registrasi berhasil!");
      console.log("Registration success:", result);
      router.push("/login");

    } catch (error) {
      console.error("Register fetch error:", error);
      alert("Tidak dapat terhubung ke server.");
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-white mb-2">Buat Akun Baru</h1>
      <p className="text-blue-100 text-sm mb-8">Bergabunglah dengan MyStore untuk mulai berjualan atau berbelanja</p>

      <form onSubmit={handleRegisterSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">NAMA LENGKAP</label>
          <input
            type="text"
            name="name"
            value={registerData.name}
            onChange={handleRegisterChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">EMAIL ADDRESS</label>
          <input
            type="email"
            name="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            placeholder="nama@email.com"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">PHONE NUMBER</label>
          <input
            type="tel"
            name="phone"
            value={registerData.phone}
            onChange={handleRegisterChange}
            placeholder="08123456789"
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">KATA SANDI</label>
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

        <div>
          <label className="block text-xs font-semibold text-blue-100 mb-2 tracking-wider">KONFIRMASI KATA SANDI</label>
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

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition duration-200 text-center tracking-wide mt-8"
        >
          DAFTAR SEKARANG
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800 text-white/70">atau</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-white/80">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-orange-300 hover:text-orange-200 font-semibold transition">
              Masuk di sini
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
