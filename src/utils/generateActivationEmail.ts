import { sendEmail } from "./sendEmail";

export async function sendActivationEmail(email: string, token: string) {
    console.log("jalan")
  const activationLink = `${process.env.NEXT_PUBLIC_APP_URL}/store/activate?token=${token}`;

  const html = `
    <h2>Aktivasi Toko Anda</h2>
    <p>Halo,</p>
    <p>Akun toko Anda telah disetujui. Klik tombol di bawah untuk mengaktifkan toko:</p>

    <a href="${activationLink}" 
       style="
         display:inline-block;
         padding:12px 20px;
         background:#2563eb;
         color:white;
         text-decoration:none;
         border-radius:6px;
         font-weight:600;">
      Aktivasi Toko
    </a>

    <p>Atau gunakan link ini:</p>
    <p>${activationLink}</p>

    <p>Link ini berlaku selama 24 jam.</p>
  `;

  return await sendEmail(email, "Aktivasi Toko Anda", html);
}
