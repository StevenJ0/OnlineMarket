// src/app/api/admin/products/route.ts

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
        { success: false, message: "Server Misconfiguration" },
        { status: 500 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .select(
        `
        *,
        categories ( name ),
        sellers (
          store_name,
          provinces ( name )
        ),
        product_reviews ( rating ),
        product_images ( image_url, is_primary ) 
      `
      )
      // Note: Tambahan 'product_images' di atas 👆
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (error: any) {
    console.error("ADMIN PRODUCT API ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}, ["seller"]);