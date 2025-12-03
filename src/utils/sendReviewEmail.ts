import { sendEmail } from "./sendEmail";
/**
 * Mengirim email ucapan terima kasih setelah pengunjung memberikan ulasan.
 * * @param email - Email tujuan (Guest)
 * @param name - Nama pengunjung (Guest)
 * @param productName - Nama produk yang diulas
 */
export async function sendReviewThankYouEmail(email: string, name: string, productName: string) {
  const html = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f97316; padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0;">Terima Kasih atas Ulasan Anda!</h2>
      </div>
      
      <div style="padding: 24px;">
        <p>Halo <strong>${name}</strong>,</p>
        
        <p>Terima kasih telah meluangkan waktu untuk memberikan ulasan pada produk <strong>"${productName}"</strong> di marketplace kami.</p>
        
        <p>Ulasan Anda sangat berharga bagi penjual dan membantu pembeli lain dalam membuat keputusan.</p>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f8fafc; border-radius: 6px; border-left: 4px solid #f97316;">
          <p style="margin: 0; font-size: 14px; color: #64748b;">
            <em>"Ulasan Anda telah berhasil diterbitkan dan dapat dilihat oleh publik."</em>
          </p>
        </div>

        <p style="margin-top: 30px;">Selamat berbelanja kembali!</p>
      </div>
      
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
        &copy; ${new Date().getFullYear()} Online Marketplace. All rights reserved.
      </div>
    </div>
  `;

  const subject = `Ulasan Anda untuk ${productName} telah diterbitkan`;

  return await sendEmail(email, subject, html);
}