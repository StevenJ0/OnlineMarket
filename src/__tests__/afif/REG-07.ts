// Memastikan checkbox "Syarat dan Ketentuan" harus dicentang sebelum registrasi dapat dilakukan

// Fungsi validasi internal untuk keperluan pengujian unit testing
export function validateTerms(agreeTerms: boolean): boolean {
  return !!agreeTerms;
}

describe("DUPL-REG-07: Validasi Checkbox Syarat dan Ketentuan", () => {
  // ===== KASUS TIDAK VALID =====
  test("menolak registrasi jika checkbox syarat dan ketentuan bernilai false", () => {
    expect(validateTerms(false)).toBe(false);
  });

  // ===== KASUS VALID =====
  test("menerima registrasi jika checkbox syarat dan ketentuan bernilai true", () => {
    expect(validateTerms(true)).toBe(true);
  });
});