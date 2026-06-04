// src/__tests__/email-template.test.ts
import { sendActivationEmail } from "../utils/generateActivationEmail";
import { sendEmail } from "../utils/sendEmail";

jest.mock("../utils/sendEmail", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

describe("Unit Testing OnlineMarket - Verifikasi Template Email (DUPL-VERIF-01)", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
  });

  it("Harus menyisipkan parameter tautan aktivasi ke dalam email", async () => {
    const testEmail = "steven@gmail.com";
    const testToken = "token-uji-555";

    await sendActivationEmail(testEmail, testToken);

    expect(sendEmail).toHaveBeenCalledTimes(1);

    const callArgs = (sendEmail as jest.Mock).mock.calls[0];
    const htmlOutput = callArgs[2];

    console.log("BUKTI HTML (HASIL MOCKING):", htmlOutput);
    const expectedLink = `http://localhost:3000/store/activate?token=${testToken}`;

    expect(htmlOutput).toContain(expectedLink);
    expect(htmlOutput).toContain(`token=${testToken}`);
  });
});
