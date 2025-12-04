"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Store,
  ShoppingBag,
  AlertCircle,
  ArrowRight,
  Activity,
  TrendingUp,
  Loader2,
} from "lucide-react";

const DashboardView = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 size={48} className="animate-spin text-orange-500 mb-4" />
        <p>Memuat Dashboard...</p>
      </div>
    );
  }

  const { stats, recentStores } = data || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Dashboard Admin
        </h1>
        <p className="text-slate-400 mt-1">Selamat datang kembali, Admin.</p>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1: Total Toko */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-orange-500/30 transition-all">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Store size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">
              Total Toko
            </p>
            <h3 className="text-2xl font-bold text-white">{stats?.sellers}</h3>
          </div>
        </div>

        {/* Card 2: Perlu Validasi */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-orange-500/30 transition-all relative overflow-hidden">
          {stats?.pendingSellers > 0 && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full m-3 animate-pulse" />
          )}
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">
              Perlu Validasi
            </p>
            <h3 className="text-2xl font-bold text-white">
              {stats?.pendingSellers}
            </h3>
          </div>
        </div>

        {/* Card 3: Total Produk */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-orange-500/30 transition-all">
          <div className="p-3 bg-orange-500/10 text-orange-500 rounded-xl">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">
              Total Produk
            </p>
            <h3 className="text-2xl font-bold text-white">{stats?.products}</h3>
          </div>
        </div>

        {/* Card 4: Total User */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4 hover:border-orange-500/30 transition-all">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">
              Total User
            </p>
            <h3 className="text-2xl font-bold text-white">{stats?.users}</h3>
          </div>
        </div>
      </div>

      {/* --- MAIN ACTIONS (REQUEST ANDA) --- */}
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Activity size={20} className="text-orange-500" />
        Aksi Cepat
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Tombol Besar 1: Manajemen Toko */}
        <Link
          href="/admin/store"
          className="group relative bg-gradient-to-br from-slate-900 to-slate-900 hover:from-slate-800 hover:to-slate-900 border border-slate-800 p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/50 flex flex-col justify-between h-48"
        >
          <div className="absolute top-0 right-0 p-6 opacity-50 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <ArrowRight size={20} />
            </div>
          </div>

          <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Store size={28} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
              Daftar & Validasi Toko
            </h3>
            <p className="text-slate-400 text-sm">
              Kelola pendaftaran penjual, validasi dokumen, dan download laporan
              per wilayah.
            </p>
          </div>
        </Link>

        {/* Tombol Besar 2: Manajemen Produk */}
        <Link
          href="/admin/products"
          className="group relative bg-gradient-to-br from-slate-900 to-slate-900 hover:from-slate-800 hover:to-slate-900 border border-slate-800 p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/50 flex flex-col justify-between h-48"
        >
          <div className="absolute top-0 right-0 p-6 opacity-50 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <ArrowRight size={20} />
            </div>
          </div>

          <div className="w-14 h-14 bg-orange-500/10 text-orange-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShoppingBag size={28} />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
              Daftar & Rating Produk
            </h3>
            <p className="text-slate-400 text-sm">
              Monitoring performa produk, cek rating ulasan, dan laporan
              inventaris.
            </p>
          </div>
        </Link>
      </div>

      {/* --- RECENT ACTIVITY TABLE --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" />
            Pendaftaran Toko Terbaru
          </h3>
          <Link
            href="/admin/store"
            className="text-xs text-orange-500 hover:text-orange-400 font-semibold"
          >
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-500">
              <tr>
                <th className="p-4 pl-6">Nama Toko</th>
                <th className="p-4">Pemilik</th>
                <th className="p-4">Tanggal Daftar</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentStores?.map((store: any) => (
                <tr key={store.id} className="hover:bg-slate-800/50">
                  <td className="p-4 pl-6 font-medium text-white">
                    {store.store_name}
                  </td>
                  <td className="p-4 text-slate-400">{store.pic_name}</td>
                  <td className="p-4 text-slate-400">
                    {new Date(store.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        store.status === "active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : store.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {store.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentStores?.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              Belum ada aktivitas terbaru.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
