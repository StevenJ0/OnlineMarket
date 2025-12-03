"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Tag,
  Hash,
  FileText,
  UploadCloud,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";

export type ProductFormValues = {
  name: string;
  price: string;
  stock: string;
  description: string;
};

type ProductFormViewProps = {
  mode: "create" | "edit";              // "create" untuk tambah, "edit" untuk edit
  initialValues?: ProductFormValues;    // data awal saat edit (opsional)
};

const ProductFormView: React.FC<ProductFormViewProps> = ({
  mode,
  initialValues,
}) => {
  const [form, setForm] = useState<ProductFormValues>(
    initialValues ?? {
      name: "",
      price: "",
      stock: "",
      description: "",
    }
  );

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // di sini nanti ganti dengan call ke backend / supabase
    console.log("SUBMIT FORM:", mode, form);
    alert(
      mode === "create"
        ? "Produk baru berhasil disimpan (dummy) 👍"
        : "Perubahan produk berhasil disimpan (dummy) 👍"
    );
  };

  return (
    <div className="min-h-screen bg-[#050815]">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#ff7a1a] rounded-full" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {mode === "create" ? "Tambah Produk" : "Edit Produk"}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                {mode === "create"
                  ? "Tambahkan produk baru ke dalam katalog toko Anda."
                  : "Perbarui informasi produk agar tetap akurat."}
              </p>
            </div>
          </div>
        </div>

        {/* Card Form Tambah/Edit Produk */}
        <div className="bg-[#111418] border border-slate-800 rounded-2xl p-6 sm:p-7 lg:p-8 shadow-xl shadow-black/40">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#ff7a1a]/15 text-[#ff7a1a]">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  {mode === "create" ? "Tambah Produk Baru" : "Form Edit Produk"}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Isi detail produk dengan lengkap agar mudah ditemukan pembeli.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline text-[11px] px-3 py-1 rounded-full bg-slate-800/60 text-slate-300">
              Form Produk
            </span>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-[2fr,1.2fr] gap-8"
          >
            {/* Kolom kiri: input form */}
            <div className="space-y-5">
              {/* Nama produk */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  Nama Produk
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Kopi Arabica 250gr"
                  className="w-full rounded-xl bg-[#0a0c10] border border-slate-700/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]/70 focus:border-[#ff7a1a]"
                  required
                />
              </div>

              {/* Harga & Stok */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-400" />
                    Harga Produk
                  </label>
                  <div className="flex items-center gap-2 rounded-xl bg-[#0a0c10] border border-slate-700/70 px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-[#ff7a1a]/70 focus-within:border-[#ff7a1a]">
                    <span className="text-xs text-slate-500">Rp</span>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full bg-transparent text-sm text-slate-100 outline-none"
                      min={0}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-slate-400" />
                    Jumlah Stok
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Masukkan jumlah barang"
                    className="w-full rounded-xl bg-[#0a0c10] border border-slate-700/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]/70 focus:border-[#ff7a1a]"
                    min={0}
                    required
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Deskripsi Produk
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tulis deskripsi singkat mengenai keunggulan, komposisi, dan informasi penting lain."
                  rows={4}
                  className="w-full rounded-xl bg-[#0a0c10] border border-slate-700/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]/70 focus:border-[#ff7a1a] resize-none"
                  required
                />
              </div>

              {/* Tombol submit */}
              <div className="pt-2 flex justify-end">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => router.push("/penjual/product")}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700/70 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-900/40 transition-colors"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff7a1a] to-[#ff9c3b] px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-[#ff7a1a]/40 hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    <PlusCircle className="w-4 h-4" />
                    {mode === "create" ? "Simpan Produk" : "Simpan Perubahan"}
                  </button>
                </div>
              </div>
            </div>

            {/* Kolom kanan: upload + preview */}
            <div className="space-y-4">
              {/* Upload gambar */}
              <div className="rounded-xl border border-dashed border-slate-700/80 bg-[#0b0f17] p-4">
                <p className="text-xs font-semibold text-slate-300 mb-2">
                  Tampilan / Foto Produk
                </p>
                <label className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/40 px-4 py-6 cursor-pointer hover:border-[#ff7a1a]/70 hover:bg-slate-900/80 transition-colors">
                  <UploadCloud className="w-6 h-6 text-[#ff7a1a]" />
                  <span className="text-xs text-slate-300 font-medium">
                    Klik untuk unggah gambar
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Format JPG, PNG, maksimal 2MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-slate-800 bg-[#0b0f17] p-4">
                <p className="text-xs font-semibold text-slate-300 mb-3">
                  Preview Produk
                </p>

                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview produk"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold text-slate-100">
                      {form.name || "Nama produk akan tampil di sini"}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {form.description ||
                        "Deskripsi singkat produk akan muncul di area ini."}
                    </p>
                    <p className="text-sm font-semibold text-[#ff7a1a] mt-1">
                      {form.price
                        ? `Rp ${Number(form.price).toLocaleString("id-ID")}`
                        : "Rp 0"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Stok: {form.stock || "0"} unit
                    </p>
                  </div>
                </div>
              </div>

              {/* Info kecil */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <AlertTriangle className="w-3 h-3 text-yellow-400" />
                <span>
                  Pastikan data sudah benar. Anda dapat mengedit produk setelah
                  disimpan.
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormView;
