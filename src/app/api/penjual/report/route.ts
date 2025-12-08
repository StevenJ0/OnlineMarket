import { NextResponse } from "next/server";
import { getSellerByUserId, getSellerReportData } from "@/lib/supabase/service"; 
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. CEK TOKEN
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: Token missing" }, { status: 401 });
    }

    // 2. DECODE TOKEN
    const secret = process.env.JWT_SECRET!;
    let userId;
    try {
      const decoded = jwt.verify(token, secret) as any;
      userId = decoded.id || decoded.user_id;
    } catch (e) {
      return NextResponse.json({ success: false, message: "Unauthorized: Token invalid" }, { status: 401 });
    }

    // 3. CEK SELLER (Menggunakan fungsi admin bypass RLS)
    const { data: seller, error } = await getSellerByUserId(userId);

    if (error || !seller) {
      return NextResponse.json({ success: false, message: "Forbidden: Bukan akun seller" }, { status: 403 });
    }

    // 4. AMBIL DATA
    const reportData = await getSellerReportData(seller.id);

    return NextResponse.json({
      success: true,
      data: reportData,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Report API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}