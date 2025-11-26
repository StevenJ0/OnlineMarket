"use client"

import { useEffect, useState } from "react"
import FormFillingIllustration from "@/components/register-illustration"
import RegisterForm from "@/components/register-form"

export default function RegisterPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-cyan-900/50 backdrop-blur-sm">
          <div className="flex">
            {/* Form Section - LEFT */}
            <div
              className={`w-1/2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 p-12 flex items-center justify-center transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"
              }`}
            >
              <RegisterForm />
            </div>

            {/* Illustration Section - RIGHT */}
            <div
              className={`w-1/2 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 p-12 flex flex-col items-center justify-center transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
              }`}
            >
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
  )
}
