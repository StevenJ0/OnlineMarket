"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifikasiEmailPage() {
  const [secondsLeft, setSecondsLeft] = useState(90); // 1 menit 30 detik
  const [isVerified, setIsVerified] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  // Countdown
  useEffect(() => {
    if (isVerified) return; // kalau sudah verif, stop timer
    if (secondsLeft <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [secondsLeft, isVerified]);

  // Format mm:ss
  function formatTime(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const canResend = !isVerified && secondsLeft <= 0;

  function handleMarkVerified() {
    setIsVerified(true);
    setInfo(null);
  }

  function handleResend() {
    if (!canResend) return;
    // UI only: anggap email terkirim lagi dan reset timer
    setSecondsLeft(90);
    setInfo("Email verifikasi dikirim ulang. Silakan cek email kamu.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="animate-fade-up w-full max-w-md rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-sm">
        {/* TITLE */}
        <h1 className="mb-3 text-2xl font-bold text-white">
          {isVerified ? "Verifikasi Berhasil 🎉" : "Cek Email Kamu ✉️"}
        </h1>

        {/* DESCRIPTION */}
        {!isVerified ? (
          <>
            <p className="mb-1 text-sm text-white/80">
              Kami sudah mengirimkan email verifikasi ke email yang kamu daftarkan.
            </p>
            <p className="mb-3 text-sm text-white/70">
              Klik tombol verifikasi pada email untuk melanjutkan proses buka toko.
            </p>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-orange-300">
              Waktu menunggu verifikasi: {" "}
              <span className="font-mono text-base text-white">{formatTime(secondsLeft)}</span>
            </p>
          </>
        ) : (
          <>
            <p className="mb-2 text-sm text-gray-700">
              Terima kasih! Email kamu sudah terverifikasi.
            </p>
            <p className="mb-6 text-sm text-gray-600">
              Sekarang kamu bisa melanjutkan ke desain / pengaturan toko.
            </p>
          </>
        )}

        {/* INFO MESSAGE */}
        {info && !isVerified && (
          <div className="mb-4 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-xs text-white/80">
            {info}
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col gap-3">
          {!isVerified && (
            <>
              {/* Tombol: Saya sudah verifikasi */}
              <button
                type="button"
                onClick={handleMarkVerified}
                className="rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-400 transition hover:bg-orange-600"
              >
                Saya Sudah Verifikasi
              </button>

              {/* Kirim ulang email */}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={`rounded-lg px-4 py-3 text-sm font-semibold shadow-md transition ${
                  canResend
                    ? "bg-orange-500 text-white shadow-orange-400 hover:bg-orange-600"
                    : "cursor-not-allowed bg-gray-700/40 text-gray-300 shadow-none"
                }`}
              >
                {canResend
                  ? "Kirim Ulang Email Verifikasi"
                  : `Kirim Ulang Email (${formatTime(secondsLeft)})`}
              </button>
            </>
          )}

          {/* Kembali (selalu ada) */}
          <Link
            href="/buka-toko"
            className="mt-1 rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-black/20 transition hover:bg-white/20"
          >
            Kembali
          </Link>

          {/* Cek desain — hanya muncul jika sudah verifikasi */}
          {isVerified && (
            <Link
              href="/"
              className="rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-400 transition hover:bg-orange-600"
            >
              Balik Ke Home
            </Link>
          )}
        </div>

        {/* FOOTNOTE */}
        <p className="mt-6 text-[11px] text-gray-400">
          *Halaman ini masih UI saja. Integrasi verifikasi asli akan dibuat saat backend sudah siap.
        </p>
      </div>
    </main>
  );
}
