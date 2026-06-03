// src/__tests__/rafi/dupl-store-15.test.ts
import { POST } from "@/app/api/store/route";

describe("Unit Testing OnlineMarket - Registrasi Toko / Buka Toko (DUPL-STORE-15)", () => {
  // DUPL-STORE-15: Memastikan muncul pesan error ketika field wajib dikosongkan.
  // Pada server (POST /api/store), dokumen wajib (File KTP & Foto PIC) divalidasi
  // sebelum data disimpan. Jika field wajib tersebut dikosongkan, request harus
  // ditolak dengan status 400 beserta pesan error.

  it("Harus menolak dengan status 400 ketika seluruh field (termasuk dokumen wajib) dikosongkan", async () => {
    // Form benar-benar kosong: tidak ada file KTP maupun Foto PIC
    const formData = new FormData();

    const request = new Request("http://localhost:3000/api/store", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(400);

    const responseData = await response.json();
    console.log("BUKTI RESPON API (form kosong):", responseData);
    expect(responseData.message).toMatch(/tidak ditemukan|wajib|KTP|PIC/i);
  });

  it("Harus tetap menolak dengan status 400 ketika field teks diisi tetapi dokumen wajib (KTP/Foto PIC) dikosongkan", async () => {
    // Field teks diisi, namun file wajib (ktpFile & picPhoto) sengaja tidak dilampirkan
    const formData = new FormData();
    formData.append("storeName", "Toko Uji");
    formData.append("description", "Deskripsi toko uji");
    formData.append("picName", "Rafi Althaf");
    formData.append("picPhone", "081234567890");
    formData.append("picEmail", "rafi@gmail.com");
    formData.append("addressStreet", "Jl. Pengujian No. 1");
    formData.append("ktpNumber", "3201010101010001");

    const request = new Request("http://localhost:3000/api/store", {
      method: "POST",
      body: formData,
    });

    const response = await POST(request);

    expect(response.status).toBe(400);

    const responseData = await response.json();
    console.log("BUKTI RESPON API (dokumen wajib kosong):", responseData);
    expect(responseData.message).toMatch(/tidak ditemukan|KTP|PIC/i);
  });
});
