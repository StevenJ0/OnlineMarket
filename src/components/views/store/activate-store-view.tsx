"use client";

import { useEffect, useState } from "react";

export default function ActivateStoreView() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken);
  }, []);

  console.log("Token:", token);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const res = await fetch("/api/store/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        setStatus(data.status);
        setMessage(data.message);
      } catch (err) {
        setStatus("error");
        setMessage("Terjadi kesalahan server.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen px-5">
      <div className="max-w-md w-full p-6 rounded-lg shadow border">
        {!token && <p>Token tidak ditemukan.</p>}

        {status === "loading" && <p>⏳ Memverifikasi token aktivasi...</p>}

        {status === "success" && (
          <div>
            <h1 className="text-xl font-bold mb-2 text-green-600">Aktivasi Berhasil</h1>
            <p>{message}</p>
            <a href="/login" className="text-blue-600 underline">Pergi ke Login</a>
          </div>
        )}

        {status === "error" && (
          <div>
            <h1 className="text-xl font-bold mb-2 text-red-600">Aktivasi Gagal</h1>
            <p>{message}</p>
          </div>
        )}

        {status === "expired" && (
          <div>
            <h1 className="text-xl font-bold mb-2 text-yellow-600">Token Kadaluarsa</h1>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
