import { NextResponse } from 'next/server';
import { sendReviewThankYouEmail } from '@/utils/sendReviewEmail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, productName } = body;

    if (!email || !name || !productName) {
      return NextResponse.json(
        { message: 'Data tidak lengkap (Email, Nama, atau Nama Produk hilang)' },
        { status: 400 }
      );
    }

    const result = await sendReviewThankYouEmail(email, name, productName);

    if (result.success) {
      return NextResponse.json({ message: 'Email berhasil dikirim' }, { status: 200 });
    } else {
      console.error("Gagal mengirim email:", result.error);
      return NextResponse.json({ message: 'Gagal mengirim email' }, { status: 500 });
    }

  } catch (error) {
    console.error("Server Error (Email API):", error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}