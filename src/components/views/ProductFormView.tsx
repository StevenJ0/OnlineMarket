"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Tag,
  Hash,
  FileText,
  UploadCloud,
  PlusCircle,
  AlertTriangle,
  X,
  Image,
} from "lucide-react";

export type ProductFormValues = {
  name: string;
  price: string;
  stock: string;
  description: string;
  category_id?: string;
  status?: string;
};

type ProductFormViewProps = {
  mode: "create" | "edit";              
  initialValues?: ProductFormValues;    
  initialImages?: string[];
  initialPrimaryIndex?: number;
  productId?: string;
};

const ProductFormView: React.FC<ProductFormViewProps> = ({
  mode,
  initialValues,
  initialImages = [],
  initialPrimaryIndex = 0,
  productId,
}) => {
  const [form, setForm] = useState<ProductFormValues>(
    initialValues ?? {
      name: "",
      price: "",
      stock: "",
      description: "",
    }
  );

  console.log("initialValues:", initialValues);
  console.log("initialImages:", initialImages);
  console.log("initialPrimaryIndex:", initialPrimaryIndex);
  console.log(productId)

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(initialImages || []);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialValues?.category_id || "");
  const [status, setStatus] = useState<string>(initialValues?.status || "active");
  const [loading, setLoading] = useState<boolean>(true);
  const [userSession, setUserSession] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [primaryIndex, setPrimaryIndex] = useState<number | null>(initialPrimaryIndex);

  console.log(primaryIndex);

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

  const fetchAllCategories = async () => {
    try {
      const res = await fetch("/api/categories", { method: "GET" });
      const data = await res.json();
      return data.data[0] || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchAllCategories();
      setCategories(data);
    };

    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session", { method: "GET" });
        const data = await res.json();
        setUserSession(data.user);
        setSessionId(data.user?.id || null);
      } catch (err) {
        console.error("Gagal mengambil sesi:", err);
      } finally {
        setLoading(false);
      }
    };

    if (initialValues) {
        if (initialValues.category_id) setSelectedCategory(initialValues.category_id);
        if (initialValues.status) setStatus(initialValues.status);
    }

    if (mode === "edit" ) {
      setImagePreviews(initialImages);
      setPrimaryIndex(initialPrimaryIndex);
    }
    loadCategories();
    fetchSession();
  }, []);

  console.log("User session:", userSession);
  console.log("Session ID:", sessionId);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    
    // Tambahkan file baru ke array yang sudah ada
    const newImages = [...images, ...files];
    setImages(newImages);

    // Generate preview untuk file baru
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    if (primaryIndex === index) {
      setPrimaryIndex(0);
    } else if (primaryIndex! > index) {
      setPrimaryIndex(primaryIndex! - 1);
    }
  };

  const handleCreateProduct = async () => {
    if (images.length === 0) {
      alert("Harap upload minimal 1 gambar produk");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("description", form.description);
      formData.append("category_id", selectedCategory);
      formData.append("status", status);

      images.forEach((file) => formData.append("images", file));
      formData.append("primaryIndex", primaryIndex?.toString() || "0");

      const res = await fetch("/api/penjual/product?storeId=" + sessionId, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/penjual/product");
      } else {
        const error = await res.json();
        alert(error.message || "Gagal menambahkan produk");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menambahkan produk.");
    }
  }

  const handleEditProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("description", form.description);
      formData.append("category_id", selectedCategory);
      formData.append("status", status);

      formData.append("primaryIndex", primaryIndex?.toString() || "0");

      images.forEach((file) => formData.append("images", file));

      const existingImages = imagePreviews.filter((url) => !url.startsWith("blob:"));
      formData.append("existingImages", JSON.stringify(existingImages));
      const res = await fetch("/api/penjual/product?productId=" + productId  + "&storeId=" + sessionId, {
        method: "PUT",
        body: formData,
      });
      if (res.ok) {
        router.push("/penjual/product");
      } else {
        const error = await res.json();
        alert(error.message || "Gagal memperbarui produk");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memperbarui produk.");
    }
  }


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (mode === "create") {
      await handleCreateProduct();
    } else {
      await handleEditProduct();
    }
  };

  // Cleanup preview URLs saat component unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

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

        {/* Form */}
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
            {/* Kiri */}
            <div className="space-y-5">
              {/* Nama */}
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

              {/* Kategori */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  Kategori Produk
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  className="w-full rounded-xl bg-[#0a0c10] border border-slate-700/70 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]/70 focus:border-[#ff7a1a]"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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

              {/* Status */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  Status Produk
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="w-full rounded-xl bg-[#0a0c10] border border-slate-700/70 px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]/70 focus:border-[#ff7a1a]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Tombol */}
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

            {/* Kanan: Upload + Preview */}
            <div className="space-y-4">
              <div className="rounded-xl border border-dashed border-slate-700/80 bg-[#0b0f17] p-4">
                <p className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Tampilan / Foto Produk</span>
                  {images.length > 0 && (
                    <span className="text-[#ff7a1a]">{images.length} gambar</span>
                  )}
                </p>
                <label className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-700/70 bg-slate-900/40 px-4 py-6 cursor-pointer hover:border-[#ff7a1a]/70 hover:bg-slate-900/80 transition-colors">
                  <UploadCloud className="w-6 h-6 text-[#ff7a1a]" />
                  <span className="text-xs text-slate-300 font-medium">
                    Klik untuk unggah gambar
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Format JPG, PNG. Bisa pilih beberapa gambar
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Preview Multiple */}
              <div className="rounded-xl border border-slate-800 bg-[#0b0f17] p-4">
                <p className="text-xs font-semibold text-slate-300 mb-3">
                  Preview Produk
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {imagePreviews.length > 0 ? (
                    imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-800">
                        <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />

                        {/* Badge urutan */}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
                          {idx + 1}
                        </div>

                        {/* Badge Primary */}
                        {primaryIndex === idx && (
                          <div className="absolute bottom-2 left-2 bg-[#ff7a1a] text-black text-[10px] px-2 py-0.5 rounded-full font-semibold">
                            PRIMARY
                          </div>
                        )}

                        {/* Tombol hapus */}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>

                        {/* Tombol jadikan primary */}
                        {primaryIndex !== idx && (
                          <button
                            type="button"
                            onClick={() => setPrimaryIndex(idx)}
                            className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Jadikan Utama
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-8 text-slate-600">
                      <Image className="w-8 h-8 mb-2" />
                      <span className="text-xs">Belum ada gambar</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-slate-500">
                <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>
                  Upload minimal 1 gambar. Gambar pertama akan menjadi foto utama produk.
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