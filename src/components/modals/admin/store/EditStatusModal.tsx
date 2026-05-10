// src/components/modals/admin/store/EditStatusModal.tsx

"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";

interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  currentStatus: string;
  onUpdated: () => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  { value: "rejected", label: "Rejected", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  { value: "active", label: "Active", color: "bg-green-500/10 text-green-400 border-green-500/20" },
  { value: "awaiting_activation", label: "Awaiting Activation", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
];

export default function EditStatusModal({
  isOpen,
  onClose,
  storeId,
  currentStatus,
  onUpdated,
}: EditStatusModalProps) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStatus(currentStatus);
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [isOpen, currentStatus]);

  if (!isOpen) return null;

  const updateStatus = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    console.log("jalan")

    if (!storeId) {
      setErrorMessage("Store ID tidak valid.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/admin/store?storeId=${storeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMessage(result.message || "Gagal memperbarui status.");
        return;
      }

      setSuccessMessage("Status berhasil diperbarui!");
      setTimeout(() => {
        onUpdated();
        onClose();
      }, 1000);
    } catch (error: any) {
      setErrorMessage(error.message || "Terjadi masalah koneksi.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value: string) => {
    const option = STATUS_OPTIONS.find(opt => opt.value === value);
    return option?.color || "";
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Edit Status Toko
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          
          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle size={18} className="text-green-400 mt-0.5 shrink-0" />
              <p className="text-sm text-green-400">{successMessage}</p>
            </div>
          )}

          {/* Status Label */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Pilih Status
            </label>

            {/* Status Select */}
            <select
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Preview */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2">Preview Status:</p>
            <div className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusColor(status)}`}>
              {STATUS_OPTIONS.find(opt => opt.value === status)?.label}
            </div>
          </div>

          {/* Current Status Info */}
          <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
            <p className="text-xs text-slate-400">
              Status Saat Ini: <span className="font-semibold text-slate-200">{currentStatus}</span>
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex gap-3">
          <button
            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </button>

          <button
            className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={updateStatus}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}