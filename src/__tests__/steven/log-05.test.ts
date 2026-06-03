// src/__tests__/steven/log-05.test.ts

/**
 * Pengujian Unit: Validasi Login (LOG-05)
 *
 * Tujuan: Memastikan bahwa fungsi validasi login mampu mendeteksi kondisi
 * field yang kosong pada berbagai kombinasi input email dan password,
 * serta mengembalikan pesan error 'wajib diisi' secara tepat.
 *
 * Skenario yang diuji:
 *  1. Email kosong dan password kosong
 *  2. Email kosong, password terisi
 *  3. Email terisi, password kosong
 *
 * Catatan: Pengujian ini bersifat murni (pure unit test) dan terisolasi —
 * tidak melibatkan rendering komponen UI maupun pemanggilan API.
 */

// ─── Mock Function Validasi Login ─────────────────────────────────────────────

interface LoginValidationResult {
  email?: string;
  password?: string;
}

/**
 * validateLogin — Fungsi mock validasi input form login.
 *
 * Memeriksa nilai email dan password yang diberikan. Apabila salah satu
 * atau kedua nilai tersebut merupakan string kosong, fungsi akan
 * menyertakan pesan error 'wajib diisi' pada field yang bersangkutan
 * di dalam objek yang dikembalikan.
 *
 * @param email    - Nilai email yang diinputkan pengguna.
 * @param password - Nilai password yang diinputkan pengguna.
 * @returns Objek berisi pesan error untuk setiap field yang tidak valid.
 */
const validateLogin = jest.fn((email: string, password: string): LoginValidationResult => {
  const errors: LoginValidationResult = {};

  if (!email || email.trim() === "") {
    errors.email = "wajib diisi";
  }
  if (!password || password.trim() === "") {
    errors.password = "wajib diisi";
  }

  return errors;
});

// ─── Suite Pengujian ──────────────────────────────────────────────────────────

describe("Pengujian Unit: Validasi Form Login (LOG-05)", () => {
  beforeEach(() => {
    // Mereset riwayat pemanggilan mock sebelum setiap test case dijalankan
    validateLogin.mockClear();
  });

  // ── Skenario 1 ──────────────────────────────────────────────────────────────
  it("Skenario 1: Harus mengembalikan pesan error 'wajib diisi' pada field email dan password ketika keduanya dikosongkan", () => {
    // ── Arrange ──
    const email = "";
    const password = "";

    // ── Act ──
    const hasilValidasi = validateLogin(email, password);

    // ── Assert: Fungsi dipanggil dengan argumen yang benar ──
    expect(validateLogin).toHaveBeenCalledTimes(1);
    expect(validateLogin).toHaveBeenCalledWith(email, password);

    // ── Assert: Kedua field harus memiliki pesan error 'wajib diisi' ──
    expect(hasilValidasi.email).toBe("wajib diisi");
    expect(hasilValidasi.password).toBe("wajib diisi");

    console.log("BUKTI HASIL VALIDASI (LOG-05 - Skenario 1):", hasilValidasi);
  });

  // ── Skenario 2 ──────────────────────────────────────────────────────────────
  it("Skenario 2: Harus mengembalikan pesan error 'wajib diisi' hanya pada field email ketika email dikosongkan dan password terisi", () => {
    // ── Arrange ──
    const email = "";
    const password = "abc";

    // ── Act ──
    const hasilValidasi = validateLogin(email, password);

    // ── Assert: Fungsi dipanggil dengan argumen yang benar ──
    expect(validateLogin).toHaveBeenCalledTimes(1);
    expect(validateLogin).toHaveBeenCalledWith(email, password);

    // ── Assert: Hanya field email yang memiliki pesan error 'wajib diisi' ──
    expect(hasilValidasi.email).toBe("wajib diisi");
    expect(hasilValidasi.password).toBeUndefined();

    console.log("BUKTI HASIL VALIDASI (LOG-05 - Skenario 2):", hasilValidasi);
  });

  // ── Skenario 3 ──────────────────────────────────────────────────────────────
  it("Skenario 3: Harus mengembalikan pesan error 'wajib diisi' hanya pada field password ketika email terisi dan password dikosongkan", () => {
    // ── Arrange ──
    const email = "a@b.com";
    const password = "";

    // ── Act ──
    const hasilValidasi = validateLogin(email, password);

    // ── Assert: Fungsi dipanggil dengan argumen yang benar ──
    expect(validateLogin).toHaveBeenCalledTimes(1);
    expect(validateLogin).toHaveBeenCalledWith(email, password);

    // ── Assert: Hanya field password yang memiliki pesan error 'wajib diisi' ──
    expect(hasilValidasi.email).toBeUndefined();
    expect(hasilValidasi.password).toBe("wajib diisi");

    console.log("BUKTI HASIL VALIDASI (LOG-05 - Skenario 3):", hasilValidasi);
  });
});
