// src/components/modals/ErrorModal.tsx

"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  title?: string;
}

export default function ErrorModal({
  isOpen,
  message,
  onClose,
  title = "Gagal Login",
}: ErrorModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto close setelah 5 detik
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-red-500/20 rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-slate-300 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
          >
            Tutup
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-red-500/20 rounded-b-2xl overflow-hidden">
          <div className="h-full bg-red-500 animate-pulse" style={{
            animation: "shrink 5s linear forwards"
          }} />
        </div>

        <style>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
}