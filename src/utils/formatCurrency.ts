export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "Rp 0";
  }
  
  // Menggunakan toLocaleString untuk memformat angka dengan titik ribuan khas Indonesia
  return "Rp " + Number(amount).toLocaleString('id-ID');
}

// Export kedua nama (formatRupiah dan formatCurrency) agar aman dan tidak error
export function formatCurrency(amount: number): string {
  return formatRupiah(amount);
}
