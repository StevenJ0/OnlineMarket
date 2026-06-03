// src/__tests__/register-validation.test.ts
import { POST } from "@/app/api/auth/register/route";
import { NextRequest } from "next/server";

describe("Unit Testing OnlineMarket - Modul Registrasi (DUPL-REG-05)", () => {
    it("Harus menolak registrasi dan merespon dengan status 401 jika password dan konfirmasi password tidak cocok", async () => {
        const mockRequestBody = {
            name: "Steven Test",
            email: "steven@gmail.com",
            phone: "081234567",
            password: "NilaiA123",
            confirmPassword: "NilaiB123"
        };

        const request = new NextRequest("http://localhost:3000/api/auth/register", {
            method: "POST",
            body: JSON.stringify(mockRequestBody),
        });

        const response = await POST(request);

        expect(response.status).toBe(401);

        const responseData = await response.json();
        console.log("BUKTI RESPON API:", responseData);
        expect(responseData.error).toMatch(/password/i);
    });
});