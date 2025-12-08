import { NextResponse } from "next/server";
import { withAuth } from "@/utils/withAuth";
import { supabase } from "@/lib/supabase/init";

export const GET = withAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json(
        { success: false, message: "Missing storeId" },
        { status: 400 }
      );
    }

    const { data: rawProducts, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        created_at,
        product_images (
          image_url,
          is_primary
        ),
        product_reviews (
          id,
          rating,
          comment,
          created_at,
          guest_name,
          guest_province_id,
          user_id,
          users (
            name
          ),
          provinces (
            name
          )
        )
      `)
      .eq("seller_id", storeId)
      .order("created_at", { ascending: false });

      console.log("Raw Products:", rawProducts);

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    const formattedData = rawProducts?.map((product: any) => {
      const reviews = product.product_reviews || [];
      const totalReviews = reviews.length;

      const totalRating = reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0);
      const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      const primaryImage = product.product_images?.find((img: any) => img.is_primary);
      const imageUrl = primaryImage ? primaryImage.image_url : (product.product_images?.[0]?.image_url || "");

      let positiveCount = 0;
      let neutralCount = 0;
      let negativeCount = 0;

      const formattedReviews = reviews.map((r: any) => {
        if (r.rating >= 4) positiveCount++;
        else if (r.rating === 3) neutralCount++;
        else negativeCount++;

        const provinceName = r.provinces?.name || null;

        return {
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          created_at: new Date(r.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
          guest_name: r.guest_name,
          guest_province: provinceName, // Gunakan hasil join
          user_name: r.users?.name, 
        };
      });

      const positivePercent = totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;
      const neutralPercent = totalReviews > 0 ? Math.round((neutralCount / totalReviews) * 100) : 0;
      const negativePercent = totalReviews > 0 ? Math.round((negativeCount / totalReviews) * 100) : 0;

      let trend = "flat";
      if (avgRating >= 4.5) trend = "up";
      else if (avgRating < 3.5 && totalReviews > 0) trend = "down";

      return {
        id: product.id,
        name: product.name,
        imageUrl: imageUrl,
        avgRating: parseFloat(avgRating.toFixed(1)),
        totalReviews: totalReviews,
        positivePercent,
        neutralPercent,
        negativePercent,
        trend,
        reviews: formattedReviews
      };
    });

    return NextResponse.json({ 
        success: true, 
        data: formattedData 
    });

  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}, ["user", "admin", "seller"]);