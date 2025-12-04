"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface EditStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  currentStatus: string;
  onUpdated: () => void;
}

const STATUS_OPTIONS = [
  "pending",
  "rejected",
  "active",
  "awaiting_activation",
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

  useEffect(() => {
    if (isOpen) {
      setStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  if (!isOpen) return null;

  const updateStatus = async () => {
    setErrorMessage("");

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

      onUpdated();
      onClose();
    } catch (error: any) {
      setErrorMessage(error.message || "Terjadi masalah koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">

        <h2 className="text-xl font-semibold mb-4">Edit Status Seller</h2>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded mb-3 text-sm">
            {errorMessage}
          </div>
        )}

        <label className="text-sm mb-2 block">Status</label>
        <select
          className="w-full border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 mt-5">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={updateStatus}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}
