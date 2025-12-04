import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/init";

export async function GET() {
    console.log(supabase);
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      description,
      category:categories (id, name, slug),
      seller:sellers (store_name),
      product_images (image_url, is_primary),
      product_reviews (rating)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8);

    console.log(data)

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
