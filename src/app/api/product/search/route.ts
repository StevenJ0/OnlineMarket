import { supabase } from "@/lib/supabase/init";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const query = url.searchParams.get("query") || "";
    const type = url.searchParams.get("type") || "product";

    if (!query) {
        return NextResponse.json({ data: [], error: null });
    }

    // ===== PRODUCT SEARCH =====
    if (type === "product") {
        const { data, error } = await supabase
            .from("products")
            .select(`
                id,
                name,
                price,
                status,
                category:categories(id, name),
                seller:sellers(
                    id,
                    store_name,
                    province:provinces(name),
                    city:cities(name)
                ),
                images:product_images(image_url, is_primary)
            `)
            .ilike("name", `%${query}%`);

            console.log(data);

        return NextResponse.json({ data, error });
    }

    if (type === "store") {
        console.log("jalan")
        const { data, error } = await supabase
            .from("sellers")
            .select(`
                id,
                store_name,
                province:provinces(name),
                city:cities(name)
            `)
            .ilike("store_name", `%${query}%`);

        return NextResponse.json({ data, error });
    }

    return NextResponse.json({ data: null, error: "Invalid type" }, { status: 400 });
}
