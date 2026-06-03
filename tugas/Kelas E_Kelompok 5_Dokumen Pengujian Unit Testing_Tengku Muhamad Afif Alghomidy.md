# DOKUMEN PENGUJIAN UNIT TESTING
**KELAS E - KELOMPOK 5**

**Nama Penguji:** Tengku Muhamad Afif Alghomidy (24060123140165)
**Project:** OnlineMarket (MyStore)

---

## I. Pengujian #1

* **DUPL:** DUPL-REG-07
* **Butir Uji:** Memastikan checkbox "Syarat dan Ketentuan" harus dicentang sebelum registrasi dapat dilakukan
* **Kelas Uji:** Registrasi Akun
* **SKPL:** SRS-MartPlace-01 Registrasi sebagai penjual dengan elemen data
* **Deskripsi:** 
  Pengujian ini dilakukan pada tingkat kode (unit testing) menggunakan Jest untuk memeriksa logika penanganan checkbox Syarat dan Ketentuan di file pengujian registrasi (`src/__tests__/afif/REG-07.ts`). Fokus utamanya adalah memastikan bahwa sistem menolak proses registrasi jika checkbox syarat dan ketentuan bernilai false (tidak dicentang), dan menerima proses registrasi jika checkbox tersebut bernilai true.
* **Prosedur Pengujian:**
  1. Membuat skenario data input checkbox di dalam file test, di mana nilai untuk field `agreeTerms` disimulasikan sebagai `false`.
  2. Menjalankan fungsi validasi `validateTerms` dengan membawa input `false` tersebut.
  3. Memeriksa respon dari fungsi menggunakan `expect(validateTerms(false)).toBe(false)`.
  4. Membuat skenario data input checkbox di mana nilai `agreeTerms` disimulasikan sebagai `true`.
  5. Menjalankan fungsi validasi `validateTerms` dengan membawa input `true` tersebut.
  6. Memeriksa respon dari fungsi menggunakan `expect(validateTerms(true)).toBe(true)`.
* **Masukan:**
  - Kasus 1: `agreeTerms: false`
  - Kasus 2: `agreeTerms: true`
* **Keluaran yang diharapkan:**
  - Kasus 1: Fungsi mengembalikan nilai `false` (menolak registrasi).
  - Kasus 2: Fungsi mengembalikan nilai `true` (menerima registrasi).
* **Kriteria evaluasi hasil:**
  - Sistem menolak proses registrasi jika syarat dan ketentuan belum disetujui, dan memproses registrasi jika syarat dan ketentuan disetujui. Seluruh ekspektasi unit test Jest terpenuhi (PASS).
* **Dokumentasi:** https://drive.google.com/file/d/1TWYlCdp77C5DF677h4PQheNPtNB0U5eV/view?usp=sharing
* **Fungsi yang diuji:** https://github.com/StevenJ0/OnlineMarket/blob/main/src/components/views/auth/register-form.tsx
* **Kode pengujian:** https://github.com/StevenJ0/OnlineMarket/blob/main/src/__tests__/afif/REG-07.ts
* **Hasil yang didapatkan:**
  Pengujian berjalan sukses (PASS). Sistem secara tepat mendeteksi status checkbox dan mengembalikan nilai boolean yang sesuai. Unit test Jest berhasil lolos untuk semua kasus uji.
* **Kesimpulan:** Diterima

---

## II. Pengujian #2

* **DUPL:** DUPL-SELLER-19
* **Butir Uji:** Memastikan muncul pesan error ketika produk disimpan tanpa mengupload gambar
* **Kelas Uji:** Manajemen Produk Seller
* **SKPL:** SRS-MartPlace-03 Upload produk oleh penjual dengan elemen data produk
* **Deskripsi:**
  Pengujian ini dilakukan pada tingkat kode (unit testing) menggunakan Jest untuk memeriksa logika penanganan upload gambar di file pengujian produk (`src/__tests__/afif/SELLER-19.ts`). Fokus utamanya adalah memastikan bahwa sistem menolak penyimpanan produk baru jika array gambar produk kosong, bernilai null, atau tidak berformat array, serta hanya menerima penyimpanan produk apabila minimal 1 gambar telah diunggah.
* **Prosedur Pengujian:**
  1. Membuat skenario data input gambar di dalam file test, di mana nilai disimulasikan sebagai array kosong `[]`, `null`, dan string non-array `"bukan_array"`.
  2. Menjalankan fungsi validasi `validateProductImages` dengan membawa input-input tidak valid tersebut.
  3. Memeriksa respon dari fungsi menggunakan `expect(validateProductImages(input)).toBe(false)`.
  4. Membuat skenario data input gambar di mana array berisi satu atau beberapa file gambar valid.
  5. Menjalankan fungsi validasi `validateProductImages` dengan membawa input valid tersebut.
  6. Memeriksa respon dari fungsi menggunakan `expect(validateProductImages(input)).toBe(true)`.
* **Masukan:**
  - Kasus Tidak Valid: `[]`, `null`, `"bukan_array"`
  - Kasus Valid: `["produk_image_1.png"]`, `["produk_image_1.png", "produk_image_2.png"]`
* **Keluaran yang diharapkan:**
  - Kasus Tidak Valid: Fungsi mengembalikan nilai `false` (menolak penyimpanan).
  - Kasus Valid: Fungsi mengembalikan nilai `true` (menerima penyimpanan).
* **Kriteria evaluasi hasil:**
  - Sistem menolak proses penyimpanan produk jika tidak ada gambar yang diunggah. Seluruh ekspektasi unit test Jest terpenuhi (PASS).
* **Dokumentasi:** https://drive.google.com/file/d/1yeDuZC1p7WMJ3uGTb9TdP3jMGefPF9FM/view?usp=sharing
* **Fungsi yang diuji:** https://github.com/StevenJ0/OnlineMarket/blob/main/src/components/views/ProductFormView.tsx
* **Kode pengujian:** https://github.com/StevenJ0/OnlineMarket/blob/main/src/__tests__/afif/SELLER-19.ts
* **Hasil yang didapatkan:**
  Pengujian berjalan sukses (PASS). Fungsi validasi berhasil memblokir penyimpanan produk tanpa gambar dan meloloskan produk dengan gambar. Unit test Jest berhasil lolos untuk semua kasus uji.
* **Kesimpulan:** Diterima
