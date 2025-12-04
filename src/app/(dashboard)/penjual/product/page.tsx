"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Tag,
  Boxes,
  CircleCheck,
  CircleX,
} from "lucide-react";

// TIPE DATA (Sesuai DB: products)
type ProductRow = {
  id: string; // UUID
  name: string;
  price: number;
  stock: number;
  // category_id: string; // Di DB pakai ID, di FE kita tampilkan Nama Kategori (hasil join)
  category_name: string; 
  status: "active" | "inactive";
};

const DUMMY_PRODUCTS: ProductRow[] = [
  { id: "uuid-1", name: "Samsung Galaxy S22 Ultra", price: 17500000, stock: 12, category_name: "Smartphone", status: "active" },
  { id: "uuid-2", name: "iPhone 14 Pro Max", price: 21000000, stock: 8, category_name: "Smartphone", status: "active" },
  { id: "uuid-3", name: "Xiaomi Mi 11 Lite", price: 3500000, stock: 15, category_name: "Smartphone", status: "inactive" },
  { id: "uuid-4", name: "Kopi Arabica", price: 75000, stock: 1, category_name: "Minuman", status: "active" },
];

export default function ProductPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>(DUMMY_PRODUCTS);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q)
    );
  }, [query, products]);

  const handleAddProduct = () => router.push("/penjual/product/add");
  const handleEdit = (product: ProductRow) => router.push(`/penjual/product/${product.id}/edit`);

  const handleDelete = (product: ProductRow) => {
    if (confirm(`Hapus produk "${product.name}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      // TODO: Panggil API deleteData('products', id)
    }
  };

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
      )
    );
    // TODO: Panggil API updateData('products', id, { status: ... })
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock < 2) return "bg-red-500/15 text-red-400"; // Kritis sesuai SRS
    if (stock < 5) return "bg-yellow-500/15 text-yellow-400";
    return "bg-green-500/15 text-green-400";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xl relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="w-full rounded-xl bg-[#050815] border border-slate-800 px-9 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]/70"
          />
        </div>
        <button
          onClick={handleAddProduct}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff7a1a] to-[#ff9c3b] px-4 py-2.5 text-sm font-semibold text-black shadow-lg shadow-[#ff7a1a]/40 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      <div className="bg-[#050815] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-[1.5fr,0.9fr,0.6fr,0.8fr,0.6fr,0.6fr] px-4 sm:px-6 py-3 border-b border-slate-800 text-[11px] font-semibold tracking-wide uppercase text-slate-500">
          <div>Produk</div>
          <div>Harga</div>
          <div>Stok</div>
          <div>Kategori</div>
          <div>Status</div>
          <div className="text-right">Aksi</div>
        </div>

        <div className="divide-y divide-slate-800 max-h-[520px] overflow-y-auto custom-scrollbar">
          {filteredProducts.map((product) => (
            <div key={product.id} className="grid grid-cols-[1.5fr,0.9fr,0.6fr,0.8fr,0.6fr,0.6fr] px-4 sm:px-6 py-3.5 items-center hover:bg-slate-900/40">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-100 shrink-0">
                  {product.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">{product.name}</p>
                </div>
              </div>

              <div className="text-sm font-semibold text-[#ff7a1a]">Rp {product.price.toLocaleString("id-ID")}</div>
              
              <div>
                <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-medium ${getStockBadgeColor(product.stock)}`}>
                  {product.stock} unit
                </span>
              </div>

              <div className="text-sm text-slate-300">{product.category_name}</div>

              <div>
                <button onClick={() => toggleStatus(product.id)} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${product.status === "active" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"} hover:opacity-80`}>
                  {product.status === "active" ? <CircleCheck className="w-3 h-3" /> : <CircleX className="w-3 h-3" />}
                  {product.status === "active" ? "Active" : "Inactive"}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button onClick={() => handleEdit(product)} className="p-1.5 text-slate-300 hover:text-blue-400 bg-slate-900/40 rounded-full border border-slate-700/50"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(product)} className="p-1.5 text-slate-300 hover:text-red-400 bg-slate-900/40 rounded-full border border-slate-700/50"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && <div className="px-6 py-10 text-center text-sm text-slate-500">Produk tidak ditemukan.</div>}
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ff7a1a; border-radius: 9999px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #050815; }
      `}</style>
    </div>
  );
}