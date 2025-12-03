"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown, Package, DollarSign, AlertTriangle, Clock, User, ShoppingBag } from "lucide-react";

type DashboardStat = {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  highlight?: boolean;
  trendText?: string;
  trendUp?: boolean;
};

type Order = {
  invoice: string;
  customer: string;
  time: string;
  total: string;
  status: 'new' | 'processing' | 'completed';
};

type LowStockProduct = {
  name: string;
  sku: string;
  stock: number;
  urgency: 'critical' | 'warning' | 'low';
};

export default function DashboardPage() {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  const stats: DashboardStat[] = [
    {
      id: "total",
      title: "Total Produk",
      value: "151",
      subtitle: "Gabungan aktif & tidak aktif",
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "active",
      title: "Produk Aktif",
      value: "128",
      subtitle: "",
      icon: <ShoppingBag className="w-5 h-5" />,
      trendText: "+5 produk minggu ini",
      trendUp: true,
    },
    {
      id: "inactive",
      title: "Produk Tidak Aktif",
      value: "23",
      subtitle: "",
      icon: <Package className="w-5 h-5" />,
      trendText: "-2 produk bulan ini",
      trendUp: false,
    },
    {
      id: "revenue",
      title: "Pemasukan Bulan Ini",
      value: "Rp 12.450.000",
      subtitle: "",
      icon: <DollarSign className="w-5 h-5" />,
      highlight: true,
      trendText: "+8% dari bulan lalu",
      trendUp: true,
    },
  ];

  const ordersToday: Order[] = [
    { invoice: "INV-2025-001", customer: "Budi Santoso", time: "10.23 WIB", total: "Rp 320.000", status: 'new' },
    { invoice: "INV-2025-002", customer: "Siti Aminah", time: "09.58 WIB", total: "Rp 185.000", status: 'new' },
    { invoice: "INV-2025-003", customer: "Andi Wijaya", time: "09.15 WIB", total: "Rp 540.000", status: 'processing' },
    { invoice: "INV-2025-004", customer: "Rahma Putri", time: "08.47 WIB", total: "Rp 210.000", status: 'processing' },
    { invoice: "INV-2025-005", customer: "Dedi Firmansyah", time: "08.10 WIB", total: "Rp 150.000", status: 'completed' },
    { invoice: "INV-2025-006", customer: "Lina Marlina", time: "07.55 WIB", total: "Rp 275.000", status: 'completed' },
  ];

  const lowStockProducts: LowStockProduct[] = [
    { name: "Kopi Arabica 250gr", sku: "KOPI-AR-250", stock: 2, urgency: 'critical' },
    { name: "Teh Hijau Premium", sku: "TEH-HIJAU", stock: 1, urgency: 'critical' },
    { name: "Gula Aren Cair 500ml", sku: "GULA-AREN-500", stock: 3, urgency: 'warning' },
    { name: "Susu Oat Barista 1L", sku: "SUSU-OAT-1L", stock: 4, urgency: 'warning' },
    { name: "Cokelat Bubuk 200gr", sku: "COKLAT-200", stock: 2, urgency: 'critical' },
    { name: "Sirup Vanilla 750ml", sku: "SIRUP-VNL", stock: 1, urgency: 'critical' },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-orange-400';
      default: return 'text-yellow-400';
    }
  };

  const getUrgencyBg = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500/10 border-red-500/20';
      case 'warning': return 'bg-orange-500/10 border-orange-500/20';
      default: return 'bg-yellow-500/10 border-yellow-500/20';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header dengan greeting */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-[#ff7a1a] rounded-full"></div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Statistik</h1>
            <p className="text-slate-400 text-sm mt-1">Ringkasan performa toko Anda hari ini</p>
          </div>
        </div>
      </div>

      {/* Stats Cards dengan hover effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            onClick={() => setSelectedStat(stat.id === selectedStat ? null : stat.id)}
            className={`
              bg-[#111418] border rounded-xl p-5 
              transition-all duration-300 cursor-pointer
              hover:scale-105 hover:shadow-xl hover:shadow-[#ff7a1a]/10
              ${selectedStat === stat.id 
                ? 'border-[#ff7a1a] shadow-lg shadow-[#ff7a1a]/20' 
                : 'border-slate-800'
              }
              ${stat.highlight ? 'bg-gradient-to-br from-[#111418] to-[#1a1208]' : ''}
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`
                p-2 rounded-lg
                ${stat.highlight 
                  ? 'bg-[#ff7a1a]/20 text-[#ff7a1a]' 
                  : 'bg-slate-800/50 text-slate-400'
                }
              `}>
                {stat.icon}
              </div>
              {stat.trendText && (
                <div className={`flex items-center gap-1 text-xs ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </div>
              )}
            </div>

            <p className="text-slate-400 text-sm mb-2">{stat.title}</p>
            <h2 className={`text-3xl font-bold mb-2 ${stat.highlight ? 'text-[#ff7a1a]' : 'text-white'}`}>
              {stat.value}
            </h2>
            
            {stat.subtitle && (
              <p className="text-xs text-slate-500">{stat.subtitle}</p>
            )}
            
            {stat.trendText && (
              <div className={`
                mt-3 pt-3 border-t text-xs
                ${stat.highlight ? 'border-[#ff7a1a]/20' : 'border-slate-800'}
                ${stat.trendUp ? 'text-green-400' : 'text-red-400'}
              `}>
                {stat.trendText}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order & Stock Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Baru Hari Ini */}
        <div className="bg-[#111418] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
          <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-[#111418] to-[#151921]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Order Baru Hari Ini</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Update real-time</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{ordersToday.length}</div>
                <div className="text-xs text-slate-400">order</div>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {ordersToday.map((order, index) => (
                <div
                  key={order.invoice}
                  className="group flex items-center justify-between p-3 rounded-lg border border-slate-800/60 bg-[#0a0c0f]/50 hover:bg-[#1a1d24] hover:border-slate-700 transition-all duration-200"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-[#ff7a1a]/20 transition-colors">
                      <User className="w-4 h-4 text-slate-400 group-hover:text-[#ff7a1a] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{order.invoice}</p>
                      <p className="text-xs text-slate-400 truncate">{order.customer}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.time}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-[#ff7a1a] font-semibold text-sm whitespace-nowrap">{order.total}</p>
                    <div className={`
                      text-xs mt-1 px-2 py-0.5 rounded-full inline-block
                      ${order.status === 'new' ? 'bg-green-500/20 text-green-400' : ''}
                      ${order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' : ''}
                      ${order.status === 'completed' ? 'bg-slate-500/20 text-slate-400' : ''}
                    `}>
                      {order.status === 'new' && 'Baru'}
                      {order.status === 'processing' && 'Proses'}
                      {order.status === 'completed' && 'Selesai'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stok Hampir Habis */}
        <div className="bg-[#111418] border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors">
          <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-[#111418] to-[#211511]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Stok Hampir Habis</h2>
                  <p className="text-xs text-red-400 mt-0.5">Perlu tindakan segera</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-400">{lowStockProducts.filter(p => p.urgency === 'critical').length}</div>
                <div className="text-xs text-slate-400">kritis</div>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {lowStockProducts.map((product, index) => (
                <div
                  key={product.sku}
                  className={`
                    group flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                    ${getUrgencyBg(product.urgency)}
                    hover:scale-102 hover:shadow-lg
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`
                      p-2 rounded-lg transition-colors
                      ${product.urgency === 'critical' ? 'bg-red-500/20' : 'bg-orange-500/20'}
                    `}>
                      <Package className={`w-4 h-4 ${getUrgencyColor(product.urgency)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{product.name}</p>
                      <p className="text-xs text-slate-400 truncate">SKU: {product.sku}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className={`font-bold text-lg ${getUrgencyColor(product.urgency)}`}>
                      {product.stock}
                    </p>
                    <p className="text-xs text-slate-500">unit</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-600 pb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span>Data diperbarui secara real-time</span>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1d24;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff7a1a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff8c3a;
        }
      `}</style>
    </div>
  );
}