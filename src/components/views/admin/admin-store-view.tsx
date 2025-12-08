"use client";

import { useEffect, useState, useMemo } from "react";
import EditStatusModal from "@/components/modals/admin/store/EditStatusModal";
import {
  Download,
  Search,
  Eye,
  Edit,
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  Filter,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminStoreView = () => {
  const [listStore, setListStore] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("all");

  // State Modal & Preview
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const getAllStore = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/store", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch stores");

      const responseJson = await res.json();
      setListStore(responseJson.data || []);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllStore();
  }, []);

  const uniqueProvinces = useMemo(() => {
    const provinces = listStore
      .map((store) => store.provinces?.name)
      .filter((name) => name);

    return Array.from(new Set(provinces)).sort();
  }, [listStore]);

  const filteredStores = listStore.filter((store) => {
    const matchesSearch =
      store.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.pic_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.status?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProvince =
      provinceFilter === "all" || store.provinces?.name === provinceFilter;

    return matchesSearch && matchesProvince;
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const titleSuffix =
      provinceFilter !== "all"
        ? `WILAYAH: ${provinceFilter.toUpperCase()}`
        : "SEMUA WILAYAH";

    doc.setFontSize(16);
    doc.text("LAPORAN DAFTAR AKUN PENJUAL", 14, 20);
    doc.setFontSize(12);
    doc.text(titleSuffix, 14, 28);

    doc.setFontSize(10);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleString("id-ID")}`, 14, 35);

    const tableColumn = [
      "No",
      "Nama Toko",
      "PIC",
      "Lokasi",
      "Status",
      "Tanggal Daftar",
    ];
    const tableRows: any[] = [];

    filteredStores.forEach((store, index) => {
      const city = store.cities?.name || "-";
      const province = store.provinces?.name || "-";
      const locationStr = `${city}, ${province}`;

      const storeData = [
        index + 1,
        store.store_name,
        store.pic_name,
        locationStr,
        store.status.toUpperCase(),
        new Date(store.created_at).toLocaleDateString("id-ID"),
      ];
      tableRows.push(storeData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [249, 115, 22] },
    });

    const fileName =
      provinceFilter !== "all"
        ? `Laporan_Penjual_${provinceFilter.replace(/\s/g, "_")}.pdf`
        : "Laporan_Penjual_Semua.pdf";

    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8">
      {/* --- Image Preview Modal --- */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[85vh] w-auto rounded-xl shadow-2xl border border-slate-700"
            />
            <button
              className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition shadow-lg border border-slate-700"
              onClick={() => setPreviewImage(null)}
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Manajemen Toko
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Kelola validasi dan data penjual di platform.
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all text-sm font-medium hover:border-orange-500/50"
        >
          <Download size={18} />
          <span>Download Laporan PDF</span>
        </button>
      </div>

      {/* --- Filter & Search Bar --- */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur-md flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari nama toko, PIC, atau status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Filter Provinsi Dropdown */}
        <div className="relative w-full md:w-64">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={18}
          />
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 appearance-none cursor-pointer"
          >
            <option value="all">Semua Provinsi</option>
            {uniqueProvinces.map((prov: any, idx: number) => (
              <option key={idx} value={prov}>
                {prov}
              </option>
            ))}
          </select>
          {/* Custom Chevron Arrow */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* --- Table Section --- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={40} className="animate-spin text-orange-500 mb-4" />
            <p>Memuat data toko...</p>
          </div>
        ) : filteredStores.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p>Tidak ada data toko yang sesuai filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-xs font-semibold">
                <tr>
                  <th className="p-4 pl-6">Info Toko</th>
                  <th className="p-4">Kontak PIC</th>
                  <th className="p-4">Alamat</th>
                  <th className="p-4 text-center">Dokumen</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStores.map((store) => (
                  <tr
                    key={store.id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Info Toko */}
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-base mb-1">
                          {store.store_name}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <User size={12} />
                          <span>{store.pic_name}</span>
                        </div>
                        <span className="text-slate-500 text-[10px] mt-1">
                          Joined:{" "}
                          {new Date(store.created_at).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Kontak */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Phone size={14} className="text-orange-500" />
                          <span>{store.pic_phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Mail size={14} className="text-blue-500" />
                          <span
                            className="truncate max-w-[150px]"
                            title={store.pic_email}
                          >
                            {store.pic_email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Alamat */}
                    <td className="p-4">
                      <div className="flex items-start gap-2 max-w-xs">
                        <MapPin
                          size={14}
                          className="text-red-500 mt-0.5 shrink-0"
                        />
                        <p className="text-slate-400 text-xs leading-relaxed">
                          {store.street}, RT {store.rt}/RW {store.rw},{" "}
                          {store.kelurahan}, {store.cities?.name || "-"},{" "}
                          {store.provinces?.name || "-"}
                        </p>
                      </div>
                    </td>

                    {/* Dokumen */}
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <div
                          className="relative group/img cursor-pointer w-12 h-12 rounded-lg overflow-hidden border border-slate-700 hover:border-orange-500 transition-all"
                          onClick={() => setPreviewImage(store.pic_photo_url)}
                        >
                          <img
                            src={store.pic_photo_url}
                            alt="PIC"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div
                          className="relative group/img cursor-pointer w-12 h-12 rounded-lg overflow-hidden border border-slate-700 hover:border-orange-500 transition-all"
                          onClick={() =>
                            setPreviewImage(store.pic_ktp_photo_url)
                          }
                        >
                          <img
                            src={store.pic_ktp_photo_url}
                            alt="KTP"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                          store.status === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : store.status === "pending" ||
                              store.status === "awaiting_activation"
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        {store.status === "active"
                          ? "AKTIF"
                          : store.status === "awaiting_activation"
                          ? "MENUNGGU AKTIVASI"
                          : store.status === "pending"
                          ? "PENDING"
                          : "NONAKTIF"}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="p-4 text-center">
                      <button
                        className="p-2 bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-400 rounded-lg transition-all border border-slate-700 hover:border-orange-500/50 shadow-sm"
                        onClick={() => {
                          setSelectedSeller(store);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="bg-slate-950/50 p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>
              Menampilkan {filteredStores.length} dari {listStore.length} toko
            </span>
            <span>
              Filter:{" "}
              {provinceFilter === "all" ? "Semua Wilayah" : provinceFilter}
            </span>
          </div>
        )}
      </div>

      <EditStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        storeId={selectedSeller?.id || ""}
        currentStatus={selectedSeller?.status || "pending"}
        onUpdated={getAllStore}
      />
    </div>
  );
};

export default AdminStoreView;
