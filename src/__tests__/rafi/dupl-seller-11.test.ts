// DUPL-SELLER-11 

type StockValidationResult = { valid: boolean; error: string | null };

function validateStock(value: string): StockValidationResult {
  const raw = (value ?? "").trim();

  if (raw === "") {
    return { valid: false, error: "Stok produk wajib diisi" };
  }

  if (!/^\d+$/.test(raw)) {
    return { valid: false, error: "Stok hanya boleh berupa angka" };
  }

  const stock = parseInt(raw, 10);
  if (stock < 0) {
    return { valid: false, error: "Stok minimal 0" };
  }

  return { valid: true, error: null };
}

describe("Unit Testing OnlineMarket - Manajemen Produk Penjual (DUPL-SELLER-11)", () => {
  // Memastikan input stok hanya menerima angka dan minimal 0.

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
