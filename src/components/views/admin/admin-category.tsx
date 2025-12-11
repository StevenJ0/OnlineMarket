"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Loader2,
  Tag,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";

const AdminCategoryView = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // --- Fetch Data ---
  const getAllCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await res.json();
      console.log("Fetched categories:", data);
      
      // Flatten the nested array structure
      if (data.success && data.data && data.data[0]) {
        setCategories(data.data[0]);
      }
    } catch (error) {
      console.log("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const filteredCategories = categories.filter((item : any) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Kelola Kategori
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Manajemen kategori produk untuk toko online Anda.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
        >
          <Plus size={18} />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari kategori atau slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={40} className="animate-spin text-orange-500 mb-4" />
            <p>Mengambil data kategori...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Tag size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-lg font-medium mb-1">Tidak ada kategori ditemukan</p>
            <p className="text-sm">Coba ubah kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-xs font-semibold">
                <tr>
                  <th className="p-4 pl-6">No</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">ID</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredCategories.map((item : any, index ) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* No */}
                    <td className="p-4 pl-6 text-slate-400 font-mono">
                      {index + 1}
                    </td>

                    {/* Kategori */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
                          <Tag size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-orange-400 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.parent_id ? "Sub Kategori" : "Kategori Utama"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-950 text-slate-400 border border-slate-800">
                        {item.slug}
                      </span>
                    </td>

                    {/* ID */}
                    <td className="p-4">
                      <p className="font-mono text-[10px] text-slate-500 bg-slate-950/50 px-2 py-1 rounded w-fit border border-slate-800">
                        {item.id.slice(0, 13)}...
                      </p>
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        Aktif
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-blue-400 border border-transparent hover:border-slate-700"
                          title="Edit Kategori"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-red-400 border border-transparent hover:border-slate-700"
                          title="Hapus Kategori"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredCategories.length > 0 && (
          <div className="bg-slate-950/50 p-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
            <span>
              Menampilkan {filteredCategories.length} dari {categories.length} kategori
            </span>
            <span className="text-slate-600">
              Total: {categories.length} kategori
            </span>
          </div>
        )}
      </div>

      {/* Add Category Modal (Simple Placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Tambah Kategori Baru</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Fashion"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  placeholder="fashion"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all text-sm font-medium border border-slate-700"
              >
                Batal
              </button>
              <button
                className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-orange-500/20"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoryView;