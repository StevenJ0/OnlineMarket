import { supabase } from "@/lib/supabase/init";
import { withAuth } from "@/utils/withAuth";
import { NextResponse } from "next/server";


export const GET = withAuth(async (request: Request) => {
    console.log("jalan")
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("id");

    if (!storeId) {
      return NextResponse.json({ error: "Missing store ID" }, { status: 400 });
    }

    const { data: allProducts, error: productsErr } = await supabase
      .from("products")
      .select("id, name, stock, status")
      .eq("seller_id", storeId);

    console.log("All Products:", allProducts);

    if (productsErr) {
      console.error("Error fetching products:", productsErr);
      return NextResponse.json({ error: "Failed to retrieve products" }, { status: 500 });
    }

    const totalProducts = (allProducts || []).length;
    const totalActiveProducts = (allProducts || []).filter((p: any) => p.status === "active").length;
    const lowStockProducts = (allProducts || []).filter((p: any) => Number(p.stock) < 5);

    const dataProducts = {
      total_products: totalProducts,
      total_active_products: totalActiveProducts,
      low_stock_products: lowStockProducts,
    };

    console.log("Data Products:", dataProducts);

    
    const { data: rawLatest, error: latestErr } = await supabase
    .from("order_items")
    .select(`
        id,
        price,
        quantity,
        created_at,
        products!inner(id, name, seller_id),
        orders!inner(
        id,
        status,
        user_id,
        users!inner(id, name),
        payments(id, status, paid_at)
        )
    `)
    .eq("products.seller_id", storeId)
    .eq("orders.payments.status", "lunas") 
    .order("created_at", { ascending: false })
    .limit(20);

    if (latestErr) {
      console.error("Error fetching latest sold items:", latestErr);
      return NextResponse.json({ error: "Failed to retrieve latest sold items" }, { status: 500 });
    }

    const latest_items = (rawLatest || []).map((it: any) => {
      const product = Array.isArray(it.products) ? it.products[0] : it.products;
      const order = Array.isArray(it.orders) ? it.orders[0] : it.orders;
      const user = order && Array.isArray(order.users) ? order.users[0] : (order?.users ?? null);
      const payment = Array.isArray(it.payments) ? it.payments[0] : it.payments;

      return {
        id: it.id,
        product_id: product?.id ?? null,
        product_name: product?.name ?? null,
        quantity: it.quantity,
        price: Number(it.price),
        created_at: it.created_at,
        order_id: order?.id ?? null,
        order_status: order?.status ?? null,
        customer_id: order?.user_id ?? null,
        customer_name: user?.name ?? null,
        payment_status: payment?.status ?? null,
        payment_paid_at: payment?.paid_at ?? null,
      };
    });

    console.log("Latest sold items:", latest_items);

    const revenue = (rawLatest || []).reduce((sum: number, it: any) => {
      const price = Number(it.price ?? 0);
      const qty = Number(it.quantity ?? 0);
      return sum + price * qty;
    }, 0);

    return NextResponse.json(
      {
        dataProducts,
        latest_items,
        revenue,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unhandled error in dashboard API:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}, ["seller"]);
