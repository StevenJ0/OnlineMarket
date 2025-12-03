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

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive";
};

const dummyProducts: ProductRow[] = [
  { id: "1", name: "Samsung Galaxy S22 Ultra", sku: "HP-S22U", price: 17500000, stock: 12, category: "Smartphone", status: "active" },
  { id: "2", name: "iPhone 14 Pro Max", sku: "IPH-14PM", price: 21000000, stock: 8, category: "Smartphone", status: "active" },
  { id: "3", name: "Xiaomi Mi 11 Lite", sku: "XMI-11LT", price: 3500000, stock: 15, category: "Smartphone", status: "inactive" },
  { id: "4", name: "Sony WH-1000XM5", sku: "SONY-WHXM5", price: 5500000, stock: 7, category: "Audio", status: "active" },
  { id: "5", name: "JBL Flip 6", sku: "JBL-FLP6", price: 1900000, stock: 23, category: "Audio", status: "active" },
  { id: "6", name: "Apple AirPods Pro 2", sku: "APP-AP2", price: 3500000, stock: 10, category: "Audio", status: "inactive" },
  { id: "7", name: "GoPro Hero 11 Black", sku: "GOPRO-H11", price: 7500000, stock: 5, category: "Camera", status: "active" },
  { id: "8", name: "Canon EOS M50 Mark II", sku: "CAN-M50M2", price: 9000000, stock: 3, category: "Camera", status: "active" },
  { id: "9", name: "Logitech C920 Pro", sku: "LOG-C920", price: 900000, stock: 25, category: "Camera", status: "inactive" },
  { id: "10", name: "Asus ROG Strix G15", sku: "ASUS-G15R", price: 22500000, stock: 4, category: "Laptop", status: "active" },
  { id: "11", name: "MacBook Air M2", sku: "MBA-M2", price: 18500000, stock: 6, category: "Laptop", status: "active" },
  { id: "12", name: "Lenovo Legion 5", sku: "LEG-5GAM", price: 16500000, stock: 8, category: "Laptop", status: "inactive" },
  { id: "13", name: "SSD Samsung 980 Pro 1TB", sku: "SSD-980P1T", price: 2400000, stock: 18, category: "Storage", status: "active" },
  { id: "14", name: "Seagate Barracuda 2TB", sku: "SEA-BRC2T", price: 950000, stock: 30, category: "Storage", status: "active" },
  { id: "15", name: "WD Black SN850 1TB", sku: "WD-SN850", price: 2800000, stock: 10, category: "Storage", status: "inactive" },
  { id: "16", name: "TP-Link WiFi 6 AX1500", sku: "TPLINK-AX1500", price: 750000, stock: 16, category: "Smart Home", status: "active" },
  { id: "17", name: "Xiaomi Smart Camera C6", sku: "XMI-CAM-C6", price: 600000, stock: 14, category: "Smart Home", status: "active" },
  { id: "18", name: "Google Nest Hub 2", sku: "GGL-NH2", price: 1450000, stock: 9, category: "Smart Home", status: "inactive" },
  { id: "19", name: "Razer BlackWidow V3", sku: "RZR-BKV3", price: 2200000, stock: 11, category: "Accessories", status: "active" },
  { id: "20", name: "Logitech MX Master 3S", sku: "LOG-MX3S", price: 1800000, stock: 13, category: "Accessories", status: "active" },
  { id: "21", name: "Keychron K6 Wireless", sku: "KEY-K6WL", price: 1300000, stock: 12, category: "Accessories", status: "inactive" },
  { id: "22", name: "HP Ink Tank 419", sku: "HP-IT419", price: 2200000, stock: 4, category: "Printer", status: "active" },
  { id: "23", name: "Epson L3150", sku: "EPS-L3150", price: 2500000, stock: 7, category: "Printer", status: "inactive" },
  { id: "24", name: "Canon Pixma MG2570S", sku: "CAN-PX2570", price: 650000, stock: 12, category: "Printer", status: "active" },
  { id: "25", name: "Anker PowerCore 20K", sku: "ANK-PW20", price: 550000, stock: 20, category: "Accessories", status: "active" },
  { id: "26", name: "Baseus GaN Charger 65W", sku: "BAS-GAN65", price: 450000, stock: 17, category: "Accessories", status: "active" },
  { id: "27", name: "Robot RT25 Powerbank", sku: "RBT-RT25", price: 150000, stock: 28, category: "Accessories", status: "inactive" },
  { id: "28", name: "LG 24-inch IPS Monitor", sku: "LG-24IPS", price: 1900000, stock: 7, category: "Monitor", status: "active" },
  { id: "29", name: "Samsung 27-inch 144Hz", sku: "SMS-27GAM", price: 3200000, stock: 5, category: "Monitor", status: "active" },
  { id: "30", name: "Xiaomi 34 Ultrawide", sku: "XMI-34UW", price: 6500000, stock: 3, category: "Monitor", status: "inactive" },
  { id: "31", name: "Razer Kraken Tournament", sku: "RZR-KRKT", price: 1600000, stock: 9, category: "Audio", status: "active" },
  { id: "32", name: "HyperX Cloud Alpha S", sku: "HPX-ALPS", price: 1700000, stock: 10, category: "Audio", status: "active" },
  { id: "33", name: "Edifier R1700BT", sku: "EDF-1700", price: 1500000, stock: 6, category: "Audio", status: "inactive" },
  { id: "34", name: "Xiaomi Mi Band 7", sku: "XMI-MB7", price: 550000, stock: 22, category: "Wearable", status: "active" },
  { id: "35", name: "Huawei Watch GT 3", sku: "HUA-GT3", price: 2900000, stock: 8, category: "Wearable", status: "active" },
  { id: "36", name: "Amazfit GTS 4 Mini", sku: "AMZ-GTS4", price: 1500000, stock: 18, category: "Wearable", status: "inactive" },
  { id: "37", name: "Kingston 32GB Flashdisk", sku: "KNG-FD32", price: 120000, stock: 40, category: "Storage", status: "active" },
  { id: "38", name: "Sandisk Ultra 64GB", sku: "SND-FD64", price: 150000, stock: 38, category: "Storage", status: "active" },
  { id: "39", name: "Toshiba HDD 1TB", sku: "TSB-HDD1T", price: 620000, stock: 25, category: "Storage", status: "inactive" },
  { id: "40", name: "Philips LED Monitor 22", sku: "PHP-22LED", price: 1600000, stock: 6, category: "Monitor", status: "active" },
  { id: "41", name: "Mi Smart LED Bulb", sku: "XMI-LEDB", price: 150000, stock: 50, category: "Smart Home", status: "active" },
  { id: "42", name: "Google Chromecast 4K", sku: "GGL-CHR4K", price: 900000, stock: 12, category: "Smart Home", status: "inactive" },
  { id: "43", name: "TP-Link Tapo P100", sku: "TPL-P100", price: 120000, stock: 45, category: "Smart Home", status: "active" },
  { id: "44", name: "Xiaomi Electric Toothbrush", sku: "XMI-TBSH", price: 300000, stock: 32, category: "Personal Care", status: "inactive" },
  { id: "45", name: "Philips Hair Dryer BHD300", sku: "PHP-HDRY", price: 450000, stock: 14, category: "Personal Care", status: "active" },
  { id: "46", name: "Dyson Supersonic HD08", sku: "DYS-HD08", price: 7500000, stock: 2, category: "Personal Care", status: "active" },
  { id: "47", name: "Razer Viper Mini", sku: "RZR-VPMN", price: 450000, stock: 19, category: "Accessories", status: "active" },
  { id: "48", name: "SteelSeries Rival 3", sku: "STL-RV3", price: 350000, stock: 17, category: "Accessories", status: "inactive" },
  { id: "49", name: "Asus TUF Gaming K1", sku: "ASUS-K1GF", price: 690000, stock: 20, category: "Accessories", status: "active" },
  { id: "50", name: "Creative Pebble V3", sku: "CRV-PBL3", price: 550000, stock: 11, category: "Audio", status: "active" },
];

export default function ProductPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>(dummyProducts);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();

    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [query, products]);

  const handleAddProduct = () => {
    router.push("/penjual/product/add");
  };

  const handleEdit = (product: ProductRow) => {
    router.push(`/penjual/product/${product.id}/edit`);
  };

  const handleDelete = (product: ProductRow) => {
    if (confirm(`Yakin ingin menghapus produk "${product.name}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      alert("Produk dihapus (dummy). Belum terhubung ke backend 🙂");
    }
  };

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
      )
    );
  };

  const getStockBadgeColor = (stock: number) => {
    if (stock <= 3) return "bg-red-500/15 text-red-400";
    if (stock <= 10) return "bg-yellow-500/15 text-yellow-400";
    return "bg-green-500/15 text-green-400";
  };

  const getStatusBadge = (status: "active" | "inactive") =>
    status === "active"
      ? "bg-green-500/15 text-green-400"
      : "bg-red-500/15 text-red-400";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Deskripsi atas */}
      <div className="space-y-1">
        <p className="text-sm text-slate-400">
          Lihat, cari, dan kelola produk yang tersedia di toko Anda.
        </p>
      </div>

      {/* Search + Tambah Produk */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xl">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk berdasarkan nama, kategori, atau SKU..."
              className="w-full rounded-xl bg-[#050815] border border-slate-800 px-9 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]/70 focus:border-[#ff7a1a]"
            />
          </div>
        </div>

        <button
          onClick={handleAddProduct}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff7a1a] to-[#ff9c3b] px-4 sm:px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-[#ff7a1a]/40 hover:scale-[1.02] active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </button>
      </div>

      {/* Card daftar produk */}
      <div className="bg-[#050815] border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
        {/* Header kolom */}
        <div className="grid grid-cols-[1.5fr,0.9fr,0.6fr,0.8fr,0.6fr,0.6fr] px-4 sm:px-6 py-3 border-b border-slate-800 text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500">
          <div className="flex items-center gap-2">
            <Package className="w-3 h-3" />
            <span>Produk</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-3 h-3" />
            <span>Harga</span>
          </div>
          <div className="flex items-center gap-2">
            <Boxes className="w-3 h-3" />
            <span>Stok</span>
          </div>
          <div>
            <span>Kategori</span>
          </div>
          <div>
            <span>Status</span>
          </div>
          <div className="text-right">
            <span>Aksi</span>
          </div>
        </div>

        {/* List produk */}
        <div className="divide-y divide-slate-800 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-[1.5fr,0.9fr,0.6fr,0.8fr,0.6fr,0.6fr] px-4 sm:px-6 py-3.5 items-center hover:bg-slate-900/40 transition-colors"
            >
              {/* Produk */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-[11px] font-semibold text-slate-100 shrink-0">
                  {product.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    ID: #{product.id} • SKU: {product.sku}
                  </p>
                </div>
              </div>

              {/* Harga */}
              <div className="text-sm font-semibold text-[#ff7a1a]">
                Rp {product.price.toLocaleString("id-ID")}
              </div>

              {/* Stok */}
              <div>
                <span
                  className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-medium ${getStockBadgeColor(
                    product.stock
                  )}`}
                >
                  {product.stock} unit
                </span>
              </div>

              {/* Kategori */}
              <div className="text-sm text-slate-300">{product.category}</div>

              {/* Status */}
              <div>
                <button
                  onClick={() => toggleStatus(product.id)}
                  title={product.status === "active" ? "Set to Inactive" : "Set to Active"}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusBadge(
                    product.status
                  )} hover:opacity-90 transition-opacity`}
                >
                  {product.status === "active" ? (
                    <CircleCheck className="w-3 h-3" />
                  ) : (
                    <CircleX className="w-3 h-3" />
                  )}
                  {product.status === "active" ? "Active" : "Inactive"}
                </button>
              </div>

              {/* Aksi */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/40 p-1.5 text-slate-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(product)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/40 p-1.5 text-slate-300 hover:border-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              Tidak ada produk yang cocok dengan pencarian.
            </div>
          )}
        </div>
      </div>

      {/* Info kecil */}
      <p className="text-[11px] text-slate-500 text-center">
        Data di atas masih dummy. Nanti bisa dihubungkan ke database / Supabase.
      </p>

      {/* Scrollbar styling sama seperti dashboard */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #050815;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff7a1a;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff8c3a;
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #ff7a1a #050815;
        }
      `}</style>
    </div>
  );
}
