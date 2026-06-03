// src/__tests__/rafi/dupl-seller-11.test.ts

// DUPL-SELLER-11 (Unit / White Box):
// "Memastikan input stok hanya menerima angka dan minimal 0"
//
// Pada form tambah/edit produk (ProductFormView), input stok menggunakan
// <input type="number" name="stock" min={0} required /> dan pada server nilainya
// diproses dengan parseInt(stock). Aturan validasinya:
//   1. Stok wajib diisi (tidak boleh kosong).
//   2. Hanya menerima angka (bukan huruf/simbol).
//   3. Berupa bilangan bulat (stok satuan barang).
//   4. Nilai minimal 0 (tidak boleh negatif).
//
// Fungsi validateStock di bawah ini merepresentasikan aturan tersebut sehingga
// dapat diuji secara unit (white box) dengan analisis nilai batas (boundary value).

type StockValidationResult = { valid: boolean; error: string | null };

function validateStock(value: string): StockValidationResult {
  const raw = (value ?? "").trim();

  // 1. Wajib diisi
  if (raw === "") {
    return { valid: false, error: "Stok produk wajib diisi" };
  }

  // 2 & 3. Hanya angka (bilangan bulat non-negatif): tolak huruf, simbol, desimal, dan tanda minus
  if (!/^\d+$/.test(raw)) {
    return { valid: false, error: "Stok hanya boleh berupa angka" };
  }

  // 4. Minimal 0
  const stock = parseInt(raw, 10);
  if (stock < 0) {
    return { valid: false, error: "Stok minimal 0" };
  }

  return { valid: true, error: null };
}

describe("Unit Testing OnlineMarket - Manajemen Produk Penjual (DUPL-SELLER-11)", () => {
  describe("Stok yang valid (angka & minimal 0)", () => {
    it("Menerima stok = 0 (nilai batas bawah)", () => {
      const result = validateStock("0");
      console.log("BUKTI VALIDASI (stok '0'):", result);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("Menerima stok angka positif (contoh: 100)", () => {
      const result = validateStock("100");
      console.log("BUKTI VALIDASI (stok '100'):", result);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe("Stok yang tidak valid", () => {
    it("Menolak stok negatif (contoh: -1) karena di bawah nilai minimal 0", () => {
      const result = validateStock("-1");
      console.log("BUKTI VALIDASI (stok '-1'):", result);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/angka|minimal/i);
    });

    it("Menolak input non-angka / mengandung huruf (contoh: 'abc')", () => {
      const result = validateStock("abc");
      console.log("BUKTI VALIDASI (stok 'abc'):", result);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/angka/i);
    });

    it("Menolak input campuran angka dan huruf (contoh: '10a')", () => {
      const result = validateStock("10a");
      console.log("BUKTI VALIDASI (stok '10a'):", result);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/angka/i);
    });

    it("Menolak input desimal (contoh: '10.5') karena stok harus bilangan bulat", () => {
      const result = validateStock("10.5");
      console.log("BUKTI VALIDASI (stok '10.5'):", result);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/angka/i);
    });

    it("Menolak stok kosong karena wajib diisi", () => {
      const result = validateStock("");
      console.log("BUKTI VALIDASI (stok kosong):", result);
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/wajib/i);
    });
  });
});
