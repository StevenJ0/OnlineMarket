"use client";

import { useEffect, useState } from "react";

type RegisterStoreViewProps = {
  userId: string;
};

export default function RegisterStoreView({ userId }: RegisterStoreViewProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    }

    fetchSession();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("userId", userId);

      const res = await fetch("/api/store", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal mengirim data.");
        return;
      }

      alert("Registrasi berhasil!");
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim data.");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <a
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
      </a>

      <div className="mx-auto max-w-6xl">
        <div className="animate-fade-up w-full max-w-5xl rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
          <div className="mb-8">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#D2C8AA] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#49777B]">
              Formulir Registrasi
            </p>
            <h1 className="mt-4 text-3xl font-bold text-[#49777B]">
              Registrasi Data Penjual (Toko)
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Lengkapi data berikut untuk membuka toko. Tanda{" "}
              <span className="font-bold text-[#F67103]">*</span> wajib diisi.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
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

            <section>
              <SectionTitle title="Data PIC" />
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <InputField
                  name="picName"
                  label="Nama PIC"
                  required
                  placeholder="Nama penanggung jawab"
                  className="md:col-span-2"
                  defaultValue={user?.name || ""} 
                />
                <InputField
                  name="picPhone"
                  label="No HP PIC"
                  required
                  placeholder="08xxxxxxxxxx"
                />
                <InputField
                  name="picEmail"
                  label="Email PIC"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  className="md:col-span-3"
                  defaultValue={user?.email || ""} 
                />
              </div>
            </section>

            <section>
              <SectionTitle title="Alamat PIC" />
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
                <InputField
                  name="addressVillage"
                  label="Kelurahan"
                  required
                  placeholder="Nama kelurahan"
                />
                <InputField
                  name="addressDistrict"
                  label="Kab/Kota"
                  required
                  placeholder="Nama kabupaten/kota"
                />
                <InputField
                  name="addressProvince"
                  label="Provinsi"
                  required
                  placeholder="Nama provinsi"
                />
              </div>
            </section>

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

            <div className="mt-6 flex flex-col gap-3 border-t border-dashed border-gray-300 pt-6 sm:flex-row sm:justify-end">
              <a
                href="/"
                className="w-full text-center sm:text-left rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#49777B] hover:text-[#49777B] sm:w-auto"
              >
                Batal
              </a>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#F67103] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#F67103]/40 transition hover:-translate-y-0.5 hover:bg-[#D4800C] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {isLoading ? "Memproses..." : "Registrasi Penjual"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

// --- COMPONENTS ---

type InputProps = {
  label: string;
  name: string;
  required?: boolean;
  as?: "input" | "textarea";
  type?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
};

function InputField({
  label,
  name,
  required,
  as = "input",
  type = "text",
  placeholder,
  className = "",
  defaultValue
}: InputProps) {
  const baseClass =
    "w-full rounded-lg border border-white/30 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 shadow-sm transition focus:border-white focus:outline-none focus:ring-1 focus:ring-white/50";

  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
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
          defaultValue={defaultValue}
        />
      ) : (
        <input
          name={name}
          type={type}
          className={baseClass}
          placeholder={placeholder}
          required={required}
          defaultValue={defaultValue}
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
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
        {label}
        {required && <span className="ml-1 text-[#F67103]">*</span>}
      </label>

      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-600 transition hover:border-[#49777B] hover:bg-gray-100">
        <input
          name={name}
          type="file"
          required={required}
          className="w-full text-xs file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#49777B] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white file:transition file:hover:bg-[#D4800C]"
        />
        {helper && (
          <p className="mt-1 text-[11px] text-gray-500">
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
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      <h2 className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em] text-[#49777B]">
        {title}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </div>
  );
}