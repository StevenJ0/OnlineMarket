import { validateEmail } from "@/utils/validators";

describe("DUPL-REG-11: Validasi Format Email", () => {
  // ===== KASUS TIDAK VALID =====
  test("menolak email tanpa @ dan domain ('emailbiasa')", () => {
    expect(validateEmail("emailbiasa")).toBe(false);
  });

  test("menolak email dengan @ tapi tanpa domain ('email@')", () => {
    expect(validateEmail("email@")).toBe(false);
  });

  test("menolak email tanpa username ('@domain.com')", () => {
    expect(validateEmail("@domain.com")).toBe(false);
  });

  test("menolak string kosong", () => {
    expect(validateEmail("")).toBe(false);
  });

  test("menolak email dengan spasi ('user @email.com')", () => {
    expect(validateEmail("user @email.com")).toBe(false);
  });

  // ===== KASUS VALID =====
  test("menerima email dengan format valid ('user@example.com')", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  test("menerima email dengan subdomain ('user@mail.co.id')", () => {
    expect(validateEmail("user@mail.co.id")).toBe(true);
  });
});
