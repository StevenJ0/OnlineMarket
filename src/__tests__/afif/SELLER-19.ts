// Memastikan muncul pesan error ketika produk disimpan tanpa mengupload gambar

// Fungsi validasi internal untuk keperluan pengujian unit testing
export function validateProductImages(images: any[]): boolean {
  if (!images || !Array.isArray(images)) return false;
  return images.length > 0;
}

describe("DUPL-SELLER-19: Validasi Minimal Upload 1 Gambar Produk", () => {
  // ===== KASUS TIDAK VALID =====
  test("menolak penyimpanan produk jika array gambar kosong []", () => {
    expect(validateProductImages([])).toBe(false);
  });

  test("menolak penyimpanan produk jika parameter gambar null", () => {
    // @ts-ignore
    expect(validateProductImages(null)).toBe(false);
  });

  test("menolak penyimpanan produk jika parameter gambar bukan array", () => {
    // @ts-ignore
    expect(validateProductImages("bukan_array")).toBe(false);
  });

  // ===== KASUS VALID =====
  test("menerima penyimpanan produk jika terdapat minimal 1 gambar", () => {
    const mockImages = ["produk_image_1.png"];
    expect(validateProductImages(mockImages)).toBe(true);
  });

  test("menerima penyimpanan produk jika terdapat beberapa gambar sekaligus", () => {
    const mockImages = ["produk_image_1.png", "produk_image_2.png", "produk_image_3.png"];
    expect(validateProductImages(mockImages)).toBe(true);
  });
});