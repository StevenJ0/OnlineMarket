// DUPL-STORE-15

import { POST } from "@/app/api/store/route";

describe("Unit Testing OnlineMarket - Registrasi Toko / Buka Toko (DUPL-STORE-15)", () => {
  // Memastikan muncul pesan error (status 400) ketika field wajib dikosongkan.

  it("Harus menolak dengan status 400 ketika seluruh field (termasuk dokumen wajib) dikosongkan", async () => {
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
