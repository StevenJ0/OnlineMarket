export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "Rp 0";
  }
  
  return "Rp " + Number(amount).toLocaleString('id-ID');
}

export function formatCurrency(amount: number): string {
  return formatRupiah(amount);
}
