"use client";

import React, { useEffect, useState } from "react";
import { 
  TrendingUp, TrendingDown, Package, DollarSign, 
  AlertTriangle, Clock, User, ShoppingBag
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";


type ProductDB = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
};

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
  customer_name: string;
  status: string;
};

export default function DashboardPage() {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [latestTransactions, setLatestTransactions] = useState<OrderItem[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  

  const router = useRouter();


  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        const data = await res.json();
        setUserSession(data.user);
      } catch (err) {
        console.error("Gagal mengambil sesi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);


  useEffect(() => {
    if (!loading && userSession?.id) {
      fetchDashboardData(userSession.id);
    }
  }, [loading, userSession]);

  console.log(userSession)

  const fetchDashboardData = async (storeId: string) => {
    try {
      const res = await fetch(`/api/penjual/dashboard?id=${storeId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Gagal mengambil dashboard");

      const data = await res.json();

      console.log(data)

      setDashboardData(data.dataProducts);
      setLatestTransactions(data.latest_items ?? []);
      setTotalRevenue(data.revenue ?? 0);

    } catch (err) {
      console.error("Gagal fetch dashboard:", err);
    }
  };

  useEffect(() => {
    if (!loading && !userSession) {
      router.push("/login");
    }
  }, [loading, userSession, router]);

  if (loading) return null;

  const totalProducts = dashboardData?.total_products ?? 0;
  const activeProducts = dashboardData?.total_active_products ?? 0;
  const inactiveProducts = totalProducts - activeProducts;
  const lowStockProducts = dashboardData?.low_stock_products ?? [];

  console.log(activeProducts)

  const stats = [
    {
      id: "total",
      title: "Total Produk",
      value: totalProducts.toString(),
      subtitle: "Gabungan aktif & tidak aktif",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "active",
      title: "Produk Aktif",
      value: activeProducts.toString(),
      subtitle: "Produk tayang di katalog",
      icon: <ShoppingBag className="w-5 h-5" />,
      trendText: "Siap dijual",
      trendUp: true,
    },
    {
      id: "revenue",
      title: "Pemasukan",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      subtitle: "Dari item terjual",
      icon: <DollarSign className="w-5 h-5" />,
      highlight: true,
      trendText: "+8% bulan ini",
      trendUp: true,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#ff7a1a] rounded-full"></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Toko</h1>
            <p className="text-slate-400 text-sm mt-1">Ringkasan performa dan stok produk.</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            onClick={() => setSelectedStat(stat.id === selectedStat ? null : stat.id)}
            className={`
              bg-[#111418] border rounded-xl p-5 
              transition-all duration-300 cursor-pointer
              hover:scale-105 hover:shadow-xl hover:shadow-[#ff7a1a]/10
              ${selectedStat === stat.id ? "border-[#ff7a1a]" : "border-slate-800"}
              ${stat.highlight ? "bg-gradient-to-br from-[#111418] to-[#1a1208]" : ""}
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`p-2 rounded-lg ${
                  stat.highlight ? "bg-[#ff7a1a]/20 text-[#ff7a1a]" : "bg-slate-800/50 text-slate-400"
                }`}
              >
                {stat.icon}
              </div>
              {stat.trendText && (
                <div
                  className={`flex items-center gap-1 text-xs ${
                    stat.trendUp ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trendText}
                </div>
              )}
            </div>
            <p className="text-slate-400 text-sm mb-2">{stat.title}</p>
            <h2
              className={`text-3xl font-bold ${stat.highlight ? "text-[#ff7a1a]" : "text-white"}`}
            >
              {stat.value}
            </h2>
            <p className="text-xs text-slate-500 mt-2">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* PESANAN TERBARU */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111418] border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-[#111418] to-[#151921] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Item Terjual Terbaru</h2>
            </div>
          </div>

          <div className="p-5 space-y-3">
            {latestTransactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-800/60 bg-[#0a0c0f]/50"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-slate-800/50 rounded-lg">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm truncate">
                      {item.product_name} <span className="text-slate-500">x{item.quantity}</span>
                    </p>
                    <p className="text-xs text-slate-400 truncate">Pembeli: {item.customer_name}</p>
                  </div>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <p className="text-[#ff7a1a] font-semibold text-sm">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      item.status === "completed"
                        ? "text-green-400 bg-green-500/10"
                        : "text-yellow-400 bg-yellow-500/10"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}

            {latestTransactions.length === 0 && (
              <p className="text-slate-500 text-center text-sm py-4">
                Belum ada transaksi terbaru.
              </p>
            )}
          </div>
        </div>

        {/* STOCK LOW */}
        <div className="bg-[#111418] border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-[#111418] to-[#211511] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Perlu Restock</h2>
                <p className="text-xs text-red-400">Stok kritis (&lt; 2 unit)</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-red-400">{lowStockProducts.length}</div>
          </div>

          <div className="p-5 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
            {lowStockProducts.map((product : any) => (
              <div
                key={product.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  product.stock < 2
                    ? "bg-red-500/10 border-red-500/20"
                    : "bg-orange-500/10 border-orange-500/20"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`p-2 rounded-lg ${
                      product.stock < 2 ? "bg-red-500/20" : "bg-orange-500/20"
                    }`}
                  >
                    <Package
                      className={`w-4 h-4 ${
                        product.stock < 2 ? "text-red-400" : "text-orange-400"
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm truncate">{product.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      ID: {product.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      product.stock < 2 ? "text-red-400" : "text-orange-400"
                    }`}
                  >
                    {product.stock}
                  </p>
                  <p className="text-xs text-slate-500">unit</p>
                </div>
              </div>
            ))}

            {lowStockProducts.length === 0 && (
              <p className="text-slate-500 text-center text-sm py-4">
                Stok aman terkendali.
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1d24;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff7a1a;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}