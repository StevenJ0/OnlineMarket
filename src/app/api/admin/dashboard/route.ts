import { withAuth } from "@/utils/withAuth";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseAdmin =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const GET = withAuth(async () => {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: "Server Config Error" },
        { status: 500 }
      );
    }

    // 1. Hitung Total User
    const { count: userCount } = await supabaseAdmin
      .from("users")
      .select("*", { count: "exact", head: true });

    // 2. Hitung Total Toko
    const { count: sellerCount } = await supabaseAdmin
      .from("sellers")
      .select("*", { count: "exact", head: true });

    // 3. Hitung Toko Pending (Butuh Validasi)
    const { count: pendingCount } = await supabaseAdmin
      .from("sellers")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    // 4. Hitung Total Produk
    const { count: productCount } = await supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true });

    // 5. Ambil 5 Toko Terbaru (untuk list aktivitas)
    const { data: recentStores } = await supabaseAdmin
      .from("sellers")
      .select("id, store_name, pic_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          users: userCount || 0,
          sellers: sellerCount || 0,
          pendingSellers: pendingCount || 0,
          products: productCount || 0,
        },
        recentStores: recentStores || [],
      },
    });
  } catch (error: any) {
    console.error("DASHBOARD ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}, ["admin"]);
