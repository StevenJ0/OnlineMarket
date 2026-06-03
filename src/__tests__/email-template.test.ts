// src/__tests__/email-template.test.ts
import { sendActivationEmail } from "../utils/generateActivationEmail";
import { sendEmail } from "../utils/sendEmail";

// WAJIB ADA UNTUK UNIT TESTING: Mocking agar tidak kirim email ke internet
jest.mock("../utils/sendEmail", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

describe("Unit Testing OnlineMarket - Verifikasi Template Email (DUPL-VERIF-01)", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  it("Harus menyisipkan parameter tautan aktivasi ke dalam email (Tanpa Internet)", async () => {
    const testEmail = "steven@gmail.com";
    const testToken = "token-uji-555";

    await sendActivationEmail(testEmail, testToken);

    // Memastikan fungsi sendEmail dipanggil secara simulasi
    expect(sendEmail).toHaveBeenCalledTimes(1);

    // Menangkap argumen string HTML yang dikompilasi
    const callArgs = (sendEmail as jest.Mock).mock.calls[0];
    const htmlOutput = callArgs[2];

    // Tampilkan log sebagai bukti untuk laporan Anda
    console.log("BUKTI HTML (HASIL MOCKING):", htmlOutput);

    // Memeriksa parameter URL
    const expectedLink = `http://localhost:3000/store/activate?token=${testToken}`;

    expect(htmlOutput).toContain(expectedLink);
    expect(htmlOutput).toContain(`token=${testToken}`);
  });
});
