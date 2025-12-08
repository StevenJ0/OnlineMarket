"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// --- TIPE DATA ---
type Region = {
  id: string;
  name: string;
};

export default function BukaTokoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE WILAYAH ---
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");

  // --- 1. FETCH PROVINSI SAAT MOUNT ---
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch("/api/provinces");
        const data = await res.json();
        setProvinces(data.data || []);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // --- 2. HANDLE GANTI PROVINSI (AMBIL KOTA) ---
  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setCities([]); 

    if (!provinceId) return;

    try {
      const res = await fetch(`/api/cities?provinceId=${provinceId}`);
      const data = await res.json();
      setCities(data.cities || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // --- 3. HANDLE SUBMIT FORM ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch("/api/store", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal membuka toko.");
        setIsLoading(false);
        return;
      }

      alert("Registrasi toko berhasil! Silakan login menggunakan email dan password yang didaftarkan.");
      router.push("/login-penjual"); // Arahkan ke login penjual

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      {/* ARROW BACK */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-white/80 transition hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-semibold">Kembali ke Home</span>
      </Link>

      <div className="mx-auto max-w-6xl">
        <div className="animate-fade-up w-full max-w-5xl rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 p-8 shadow-2xl shadow-black/50 backdrop-blur-sm border border-white/5">
          {/* HEADER */}
          <div className="mb-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#D2C8AA] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#49777B]">
              Formulir Registrasi
            </p>
            <h1 className="mt-4 text-3xl font-bold text-[#49777B]">
              Registrasi Data Penjual (Toko)
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Lengkapi data berikut untuk membuka toko. Tanda{" "}
              <span className="font-bold text-[#F67103]">*</span> wajib diisi.
            </p>
          </div>

          {/* FORM */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* SECTION: DATA TOKO */}
            <section>
              <SectionTitle title="Data Toko" />
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <InputField
                  name="storeName"
                  label="Nama Toko"
                  required
                  placeholder="Contoh: Toko Elektronik Maju"
                />
                <InputField
                  name="description"
                  label="Deskripsi Singkat"
                  as="textarea"
                  required
                  placeholder="Ceritakan secara singkat tentang toko Anda..."
                  className="md:col-span-2"
                />
              </div>
            </section>

            {/* SECTION: DATA PIC & AKUN */}
            <section>
              <SectionTitle title="Data PIC & Akun" />
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <InputField
                  name="picName"
                  label="Nama PIC"
                  required
                  placeholder="Nama penanggung jawab"
                  className="md:col-span-2"
                />
                <InputField
                  name="picPhone"
                  label="No HP PIC"
                  required
                  placeholder="08xxxxxxxxxx"
                />
                
                {/* MODIFIKASI DISINI: Layout Email & Password */}
                <InputField
                  name="picEmail"
                  label="Email (Untuk Login)"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  className="md:col-span-2" // Menggunakan 2 kolom
                />
                
                {/* --- INPUT PASSWORD BARU --- */}
                <InputField
                  name="password"
                  label="Password"
                  type="password"
                  required
                  placeholder="Buat password aman"
                  // Default col-span-1, jadi pas di sebelah email (total 3 kolom)
                />
              </div>
            </section>

            {/* SECTION: ALAMAT PIC */}
            <section>
              <SectionTitle title="Alamat Toko / PIC" />
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <InputField
                  name="addressStreet"
                  label="Jalan"
                  required
                  placeholder="Jl. Contoh No. 123"
                  className="md:col-span-2"
                />
                <InputField name="addressRt" label="RT" required placeholder="001" />
                <InputField name="addressRw" label="RW" required placeholder="002" />
                
                {/* DROPDOWN PROVINSI */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                    Provinsi<span className="ml-1 text-[#F67103]">*</span>
                  </label>
                  <select
                    name="provinceId"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    required
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 shadow-sm transition focus:border-[#F67103] focus:outline-none focus:ring-1 focus:ring-[#F67103]"
                  >
                    <option value="" className="bg-slate-800 text-slate-400">Pilih Provinsi</option>
                    {provinces.map((prov) => (
                      <option key={prov.id} value={prov.id} className="bg-slate-800 text-white">
                        {prov.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DROPDOWN KOTA */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
                    Kab/Kota<span className="ml-1 text-[#F67103]">*</span>
                  </label>
                  <select
                    name="cityId"
                    required
                    disabled={!selectedProvince}
                    className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 shadow-sm transition focus:border-[#F67103] focus:outline-none focus:ring-1 focus:ring-[#F67103] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-slate-800 text-slate-400">Pilih Kota/Kabupaten</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id} className="bg-slate-800 text-white">
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <InputField
                  name="kelurahan"
                  label="Kelurahan"
                  required
                  placeholder="Nama kelurahan"
                  className="md:col-span-2"
                />
              </div>
            </section>

            {/* SECTION: DOKUMEN IDENTITAS */}
            <section>
              <SectionTitle title="Dokumen Identitas PIC" />
              <div className="mt-4 grid gap-4">
                <InputField
                  name="ktpNumber"
                  label="No. KTP PIC"
                  required
                  placeholder="16 digit nomor KTP"
                />

                <FileField
                  name="picPhoto"
                  label="Foto PIC"
                  required
                  helper="Format jpg/png, ukuran maksimal 2MB"
                />

                <FileField
                  name="ktpFile"
                  label="File KTP"
                  required
                  helper="Format jpg/png/pdf, ukuran maksimal 5MB"
                />
              </div>
            </section>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-col gap-3 border-t border-dashed border-slate-700 pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/"
                className="w-full rounded-lg border border-slate-600 px-6 py-3 text-center text-sm font-semibold text-slate-300 transition hover:border-[#49777B] hover:text-[#49777B] hover:bg-white/5 sm:w-auto"
              >
                Batal
              </Link>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#F67103] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#F67103]/20 transition hover:-translate-y-0.5 hover:bg-[#D4800C] disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </>
                ) : (
                  "Buka Toko Sekarang"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

// ----------------------------------------------------------------------
// SUB-COMPONENTS
// ----------------------------------------------------------------------

type InputProps = {
  label: string;
  name: string;
  required?: boolean;
  as?: "input" | "textarea";
  type?: string;
  placeholder?: string;
  className?: string;
};

function InputField({
  label,
  name,
  required,
  as = "input",
  type = "text",
  placeholder,
  className = "",
}: InputProps) {
  const baseClass =
    "w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 shadow-sm transition focus:border-[#F67103] focus:outline-none focus:ring-1 focus:ring-[#F67103]";

  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
        {label}
        {required && <span className="ml-1 text-[#F67103]">*</span>}
      </label>

      {as === "textarea" ? (
        <textarea
          name={name}
          rows={3}
          className={baseClass}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          name={name}
          type={type}
          className={baseClass}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}

type FileFieldProps = {
  label: string;
  name: string;
  required?: boolean;
  helper?: string;
};

function FileField({ label, name, required, helper }: FileFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">
        {label}
        {required && <span className="ml-1 text-[#F67103]">*</span>}
      </label>

      <div className="rounded-lg border border-dashed border-white/30 bg-white/5 px-3 py-3 text-sm text-slate-300 transition hover:border-[#49777B] hover:bg-white/10">
        <input
          name={name}
          type="file"
          required={required}
          className="w-full text-xs file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#49777B] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white file:transition file:hover:bg-[#D4800C]"
        />
        {helper && (
          <p className="mt-1 text-[11px] text-slate-400">
            {helper}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
      <h2 className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em] text-[#49777B]">
        {title}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
    </div>
  );
}