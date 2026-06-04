/**
 * Memvalidasi format email.
 * Email valid harus mengandung @ dan domain yang benar.
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Memvalidasi nilai harga.
 * Harga harus berupa angka (number) dan tidak boleh negatif (>= 0).
 */
export function validateHarga(nilai: any): boolean {
  if (typeof nilai === "string" && isNaN(Number(nilai))) return false;
  const num = Number(nilai);
  if (isNaN(num)) return false;
  return num >= 0;
}
