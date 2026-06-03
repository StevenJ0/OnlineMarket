import { validateHarga } from "@/utils/validators";

describe("DUPL-SELLER-10: Validasi Input Harga", () => {
  // ===== KASUS TIDAK VALID =====
  test("menolak nilai negatif (-1)", () => {
    expect(validateHarga(-1)).toBe(false);
  });

  test("menolak nilai negatif besar (-100)", () => {
    expect(validateHarga(-100)).toBe(false);
  });

  test("menolak string non-numerik ('abc')", () => {
    expect(validateHarga("abc")).toBe(false);
  });

  test("menolak string campuran ('12abc')", () => {
    expect(validateHarga("12abc")).toBe(false);
  });

  // ===== KASUS VALID =====
  test("menerima nilai 0", () => {
    expect(validateHarga(0)).toBe(true);
  });

  test("menerima nilai positif (50000)", () => {
    expect(validateHarga(50000)).toBe(true);
  });

  test("menerima string numerik valid ('25000')", () => {
    expect(validateHarga("25000")).toBe(true);
  });
});
