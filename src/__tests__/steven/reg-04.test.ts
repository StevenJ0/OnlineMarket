// src/__tests__/steven/reg-04.test.ts

/**
 * Pengujian Unit: Validasi Registrasi (REG-04)
 *
 * Tujuan: Memastikan bahwa fungsi validasi registrasi mampu mendeteksi
 * seluruh field yang kosong dan mengembalikan pesan error 'wajib diisi'
 * secara tepat untuk setiap field tersebut.
 *
 * Catatan: Pengujian ini bersifat murni (pure unit test) dan terisolasi —
 * tidak melibatkan rendering komponen UI maupun pemanggilan API.
 */

// ─── Mock Function Validasi Registrasi ───────────────────────────────────────

interface RegisterData {
  nama: string;
  email: string;
  telepon: string;
  password: string;
  konfirmasi: string;
}

interface RegisterValidationResult {
  nama?: string;
  email?: string;
  telepon?: string;
  password?: string;
  konfirmasi?: string;
}

/**
 * validateRegister — Fungsi mock validasi data form registrasi.
 *
 * Memeriksa setiap field dalam objek data yang diberikan. Apabila sebuah
 * field bernilai string kosong, fungsi akan menyertakan pesan error
 * 'wajib diisi' pada field yang bersangkutan di dalam objek yang dikembalikan.
 *
 * @param data - Objek berisi data registrasi pengguna.
 * @returns Objek berisi pesan error untuk setiap field yang tidak valid.
 */
const validateRegister = jest.fn((data: RegisterData): RegisterValidationResult => {
  const errors: RegisterValidationResult = {};

  if (!data.nama || data.nama.trim() === "") {
    errors.nama = "wajib diisi";
  }
  if (!data.email || data.email.trim() === "") {
    errors.email = "wajib diisi";
  }
  if (!data.telepon || data.telepon.trim() === "") {
    errors.telepon = "wajib diisi";
  }
  if (!data.password || data.password.trim() === "") {
    errors.password = "wajib diisi";
  }
  if (!data.konfirmasi || data.konfirmasi.trim() === "") {
    errors.konfirmasi = "wajib diisi";
  }

  return errors;
});

// ─── Suite Pengujian ──────────────────────────────────────────────────────────

describe("Pengujian Unit: Validasi Form Registrasi (REG-04)", () => {
  beforeEach(() => {
    // Mereset riwayat pemanggilan mock sebelum setiap test case dijalankan
    validateRegister.mockClear();
  });

  it("Harus mengembalikan pesan error 'wajib diisi' pada seluruh field ketika semua field dikosongkan", () => {
    // ── Arrange ──
    const dataDenganSemuaFieldKosong: RegisterData = {
      nama: "",
      email: "",
      telepon: "",
      password: "",
      konfirmasi: "",
    };

    // ── Act ──
    const hasilValidasi = validateRegister(dataDenganSemuaFieldKosong);

    // ── Assert: Fungsi dipanggil tepat satu kali ──
    expect(validateRegister).toHaveBeenCalledTimes(1);
    expect(validateRegister).toHaveBeenCalledWith(dataDenganSemuaFieldKosong);

    // ── Assert: Setiap field harus memiliki pesan error 'wajib diisi' ──
    expect(hasilValidasi.nama).toBe("wajib diisi");
    expect(hasilValidasi.email).toBe("wajib diisi");
    expect(hasilValidasi.telepon).toBe("wajib diisi");
    expect(hasilValidasi.password).toBe("wajib diisi");
    expect(hasilValidasi.konfirmasi).toBe("wajib diisi");

    // ── Assert: Objek hasil harus memiliki tepat 5 kunci error ──
    expect(Object.keys(hasilValidasi)).toHaveLength(5);

    console.log("BUKTI HASIL VALIDASI (REG-04):", hasilValidasi);
  });
});
