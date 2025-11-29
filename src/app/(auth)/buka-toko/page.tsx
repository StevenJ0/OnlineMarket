"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BukaTokoPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/verifikasi-email");
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
        <div className="animate-fade-up w-full max-w-5xl rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 p-8 shadow-2xl shadow-black/50 backdrop-blur-sm">
          {/* HEADER */}
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

          {/* FORM */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* SECTION: DATA TOKO */}
            <section>
              <SectionTitle title="Data Toko" />
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <InputField
                  label="Nama Toko"
                  required
                  placeholder="Contoh: Toko Elektronik Maju"
                />
                <InputField
                  label="Deskripsi Singkat"
                  as="textarea"
                  required
                  placeholder="Ceritakan secara singkat tentang toko Anda..."
                  className="md:col-span-2"
                />
              </div>
            </section>

            {/* SECTION: DATA PIC */}
            <section>
              <SectionTitle title="Data PIC" />
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <InputField
                  label="Nama PIC"
                  required
                  placeholder="Nama penanggung jawab"
                  className="md:col-span-2"
                />
                <InputField
                  label="No HP PIC"
                  required
                  placeholder="08xxxxxxxxxx"
                />
                <InputField
                  label="Email PIC"
                  type="email"
                  required
                  placeholder="nama@email.com"
                  className="md:col-span-3"
                />
              </div>
            </section>

            {/* SECTION: ALAMAT PIC */}
            <section>
              <SectionTitle title="Alamat PIC" />
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <InputField
                  label="Jalan"
                  required
                  placeholder="Jl. Contoh No. 123"
                  className="md:col-span-2"
                />
                <InputField label="RT" required placeholder="001" />
                <InputField label="RW" required placeholder="002" />
                <InputField
                  label="Kelurahan"
                  required
                  placeholder="Nama kelurahan"
                />
                <InputField
                  label="Kab/Kota"
                  required
                  placeholder="Nama kabupaten/kota"
                />
                <InputField
                  label="Provinsi"
                  required
                  placeholder="Nama provinsi"
                />
              </div>
            </section>

            {/* SECTION: DOKUMEN IDENTITAS */}
            <section>
              <SectionTitle title="Dokumen Identitas PIC" />
              <div className="mt-4 grid gap-4">
                <InputField
                  label="No. KTP PIC"
                  required
                  placeholder="16 digit nomor KTP"
                />

                <FileField
                  label="Foto PIC"
                  required
                  helper="Format jpg/png, ukuran maksimal 2MB"
                />

                <FileField
                  label="File KTP"
                  required
                  helper="Format jpg/png/pdf, ukuran maksimal 5MB"
                />
              </div>
            </section>

            {/* BUTTONS */}
            <div className="mt-6 flex flex-col gap-3 border-t border-dashed border-gray-300 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="w-full rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#49777B] hover:text-[#49777B] sm:w-auto"
              >
                <Link
                  href="/"
                >
                  Batal
                </Link  >
              </button>
              <button
                type="submit"
                className="w-full rounded-lg bg-[#F67103] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#F67103]/40 transition hover:-translate-y-0.5 hover:bg-[#D4800C] hover:shadow-lg sm:w-auto"
              >
                Registrasi Penjual
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}



type InputProps = {
  label: string;
  required?: boolean;
  as?: "input" | "textarea";
  type?: string;
  placeholder?: string;
  className?: string;
};

function InputField({
  label,
  required,
  as = "input",
  type = "text",
  placeholder,
  className = "",
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
          rows={3}
          className={baseClass}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
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
  required?: boolean;
  helper?: string;
};

function FileField({ label, required, helper }: FileFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-700">
        {label}
        {required && <span className="ml-1 text-[#F67103]">*</span>}
      </label>

      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm text-gray-600 transition hover:border-[#49777B] hover:bg-gray-100">
        <input
          type="file"
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
