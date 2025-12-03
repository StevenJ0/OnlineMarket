// src/app/(dashboard)/penjual/layout.tsx
import React from "react";
import { Sidebar } from "@/components/views/sidebar";

export default function PenjualLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050815] text-slate-50">
      {/* SIDEBAR FIXED */}
      <aside className="fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-800/80 bg-[#050815] shadow-xl">
        <Sidebar />
      </aside>

      {/* KONTEN UTAMA */}
      <main className="ml-72 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
