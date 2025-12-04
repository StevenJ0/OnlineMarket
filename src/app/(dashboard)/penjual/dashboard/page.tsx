"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  User, 
  ShoppingBag
} from "lucide-react";

// --- TIPE DATA (Sesuai Tabel 'products' & 'order_items') ---

type ProductDB = {
  id: string; // UUID
  name: string;
  price: number; // numeric
  stock: number; // integer
  status: 'active' | 'inactive'; // product_status_enum
  // description: text; // Tidak ditampilkan di card ringkas
};

type OrderItemDummy = {
  id: string;
  product_name: string; // Join dari products.name
  quantity: number;
  price: number;
  created_at: string;
  customer_name: string; // Join dari users.name
  status: 'pending' | 'processing' | 'completed'; // Join dari orders.status
};

// --- DATA DUMMY (Struktur DB Valid) ---

const MOCK_PRODUCTS: ProductDB[] = [
  { id: "p1", name: "Kopi Arabica 250gr", price: 75000, stock: 1, status: 'active' },
  { id: "p2", name: "Teh Hijau Premium", price: 45000, stock: 0, status: 'active' },
  { id: "p3", name: "Gula Aren Cair 500ml", price: 35000, stock: 3, status: 'active' },
  { id: "p4", name: "Susu Oat Barista", price: 55000, stock: 15, status: 'active' },
  { id: "p5", name: "Cokelat Bubuk 1kg", price: 120000, stock: 2, status: 'inactive' },
];

const MOCK_TRANSACTIONS: OrderItemDummy[] = [
  { id: "t1", product_name: "Kopi Arabica 250gr", quantity: 2, price: 75000, customer_name: "Budi Santoso", status: 'pending', created_at: "10:23 WIB" },
  { id: "t2", product_name: "Susu Oat Barista", quantity: 1, price: 55000, customer_name: "Siti Aminah", status: 'processing', created_at: "09:58 WIB" },
  { id: "t3", product_name: "Gula Aren Cair", quantity: 5, price: 35000, customer_name: "Andi Wijaya", status: 'completed', created_at: "Kemarin" },
];

export default function DashboardPage() {
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  // --- LOGIKA SESUAI SRS ---
  
  // 1. Total Produk
  const totalProducts = MOCK_PRODUCTS.length;
  const activeProducts = MOCK_PRODUCTS.filter(p => p.status === 'active').length;
  const inactiveProducts = MOCK_PRODUCTS.filter(p => p.status === 'inactive').length;

  // 2. Stok < 2 (Sesuai SRS: Peringatan jika stok < 2)
  // Logic: < 2 Kritis (Merah), < 5 Warning (Kuning) - Optional UI improvement
  const lowStockProducts = MOCK_PRODUCTS.filter(p => p.stock < 5).sort((a, b) => a.stock - b.stock);

  // 3. Estimasi Pendapatan (Sum dari order_items milik seller)
  // Nanti di Backend: SELECT SUM(price * quantity) FROM order_items WHERE product_id IN (seller_products)
  const totalRevenue = 12450000; // Dummy value

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
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
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
              ${selectedStat === stat.id ? 'border-[#ff7a1a]' : 'border-slate-800'}
              ${stat.highlight ? 'bg-gradient-to-br from-[#111418] to-[#1a1208]' : ''}
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.highlight ? 'bg-[#ff7a1a]/20 text-[#ff7a1a]' : 'bg-slate-800/50 text-slate-400'}`}>
                {stat.icon}
              </div>
              {stat.trendText && (
                <div className={`flex items-center gap-1 text-xs ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trendText}
                </div>
              )}
            </div>
            <p className="text-slate-400 text-sm mb-2">{stat.title}</p>
            <h2 className={`text-3xl font-bold ${stat.highlight ? 'text-[#ff7a1a]' : 'text-white'}`}>{stat.value}</h2>
            <p className="text-xs text-slate-500 mt-2">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pesanan Terbaru (Based on Order Items) */}
        <div className="bg-[#111418] border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-[#111418] to-[#151921] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg"><Clock className="w-5 h-5 text-blue-400" /></div>
              <h2 className="text-lg font-semibold text-white">Item Terjual Terbaru</h2>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {MOCK_TRANSACTIONS.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-800/60 bg-[#0a0c0f]/50">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-slate-800/50 rounded-lg"><User className="w-4 h-4 text-slate-400" /></div>
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm truncate">{item.product_name} <span className="text-slate-500">x{item.quantity}</span></p>
                    <p className="text-xs text-slate-400 truncate">Pembeli: {item.customer_name}</p>
                  </div>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <p className="text-[#ff7a1a] font-semibold text-sm">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.status === 'completed' ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stok Menipis (Logic < 2 from SRS) */}
        <div className="bg-[#111418] border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-[#111418] to-[#211511] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg animate-pulse"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
              <div>
                <h2 className="text-lg font-semibold text-white">Perlu Restock</h2>
                <p className="text-xs text-red-400">Stok kritis (&lt; 2 unit)</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-red-400">{lowStockProducts.length}</div>
          </div>
          <div className="p-5 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
            {lowStockProducts.map((product) => (
              <div key={product.id} className={`flex items-center justify-between p-3 rounded-lg border ${product.stock < 2 ? 'bg-red-500/10 border-red-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`p-2 rounded-lg ${product.stock < 2 ? 'bg-red-500/20' : 'bg-orange-500/20'}`}>
                    <Package className={`w-4 h-4 ${product.stock < 2 ? 'text-red-400' : 'text-orange-400'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-white text-sm truncate">{product.name}</p>
                    <p className="text-xs text-slate-400 truncate">ID: {product.id.substring(0,8)}...</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${product.stock < 2 ? 'text-red-400' : 'text-orange-400'}`}>{product.stock}</p>
                  <p className="text-xs text-slate-500">unit</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && <p className="text-slate-500 text-center text-sm py-4">Stok aman terkendali.</p>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a1d24; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ff7a1a; border-radius: 10px; }
      `}</style>
    </div>
  );
}