// src/__tests__/format-currency.test.ts
import { formatRupiah } from "../utils/formatCurrency";

describe("Unit Testing OnlineMarket - Format Mata Uang (DUPL-HOME-08)", () => {

    it("Harus sukses mengubah angka integer menjadi string format Rupiah", () => {
        const inputHarga = 150000;

        const hasilFormat = formatRupiah(inputHarga);
        console.log("BUKTI HASIL KONVERSI:", { input: inputHarga, output: hasilFormat });

        expect(hasilFormat).toBe("Rp 150.000");
    });
});