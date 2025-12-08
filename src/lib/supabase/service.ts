import { supabase, supabaseAdmin } from "./init";

// --- GENERIC CRUD (JANGAN DIUBAH) ---
export async function addData(table: string, data: any) {
  const db = supabaseAdmin || supabase;
  const { data: result, error } = await db.from(table).insert(data).select();
  return { data: result, error };
}

export async function updateData(table: string, id: any, data: any) {
  const db = supabaseAdmin || supabase;
  const { data: result, error } = await db.from(table).update(data).eq("id", id).select();
  return { data: result, error };
}

export async function deleteData(table: string, id: any) {
  const { data: result, error } = await supabase.from(table).delete().eq("id", id).select();
  return { data: result, error };
}

export async function RetrieveData(table: string) {
  const { data, error } = await supabase.from(table).select("*");
  return { data, error };
}

export async function RetrieveDataById(tableName: string, id: any) {
  const { data, error } = await supabase.from(tableName).select("*").eq("id", id);
  return { data, error };
}

export async function RetrieveDataByField(
  tableName: string,
  filters: { [key: string]: string | number | boolean }
) {
  let query = supabase.from(tableName).select("*");
  Object.entries(filters).forEach(([field, value]) => {
    query = query.eq(field, value);
  });
  const { data: result, error } = await query;
  return { data: result ?? [], error };
}

export async function uploadFile(bucket: string, filePath: string, file: File) {
  const db = supabaseAdmin || supabase;
  const { data, error } = await db.storage.from(bucket).upload(filePath, file, { upsert: true });
  if (error) return { url: null, error };
  const { data: publicUrlData } = db.storage.from(bucket).getPublicUrl(filePath);
  return { url: publicUrlData.publicUrl, error: null };
}

export async function verifyUserActivation(token: string) {
  if (!token) {
    return { status: "invalid", message: "Token tidak ditemukan" };
  }

  const { data: seller, error } = await RetrieveDataByField("sellers", {
    activation_token: token,
  });

  if (error) {
    return { status: "error", message: "Terjadi kesalahan pada server" };
  }

  if (!seller || seller.length === 0) {
    return { status: "invalid", message: "Token tidak valid" };
  }

  const user = seller[0];

  const now = new Date();
  const expires = new Date(user.activation_expires); // ← PERBAIKAN DI SINI

  if (now > expires) {
    return { status: "expired", message: "Token sudah kadaluarsa" };
  }

  const { error: updateError } = await updateData("sellers", user.id, {
    status: "active",
    activation_token: null,
    activation_expires: null,
    updated_at: new Date().toISOString(),
  });

  if (updateError) {
    return { status: "error", message: "Gagal mengupdate data seller" };
  }

  return { status: "success", message: "Toko berhasil diaktifkan" };
}


export type ProductStockData = {
  id: string;
  name: string;
  stock: number;
  price: number;
  category_name: string;
  rating: number;
  status: "active" | "inactive";
  items_sold: number;
};

export type DailySalesData = {
  date: string;
  items_sold: number;
  revenue: number;
};

export type RegionSalesData = {
  region: string;
  totalOrders: number;
  totalRevenue: number;
  topProduct: string;
};

// Helper
export async function getSellerByUserId(userId: string) {
  if (!supabaseAdmin) return { data: null, error: { message: "Server config error" } };
  const { data, error } = await supabaseAdmin.from("sellers").select("*").eq("user_id", userId).single();
  return { data, error };
}

// Main Function
export async function getSellerReportData(sellerId: string) {
  const db = supabaseAdmin; 
  if (!db) return { stockData: [], dailySalesData: [], regionSalesData: [] };

  // 1. Ambil Produk
  const { data: products } = await db
    .from("products")
    .select("id, name, stock, price, status, category:categories(name)")
    .eq("seller_id", sellerId);

  if (!products || products.length === 0) {
    return { stockData: [], dailySalesData: [], regionSalesData: [] };
  }

  const productIds = products.map((p) => p.id);

  // 2. Ambil Review & Transaksi
  const [reviewsRes, ordersRes] = await Promise.all([
    db.from("product_reviews").select("product_id, rating").in("product_id", productIds),
    db.from("order_items").select(`
      quantity, price, product_id,
      orders (created_at, address:addresses (province:provinces (name))),
      products (name)
    `).in("product_id", productIds)
  ]);

  const reviews = reviewsRes.data || [];
  const orderItems = ordersRes.data || [];

  // --- AGGREGATION LOGIC ---

  // A. Hitung Rating & Penjualan per Produk
  const productStats: Record<string, { ratingSum: number; ratingCount: number; sold: number }> = {};
  
  // Init map
  productIds.forEach(id => { productStats[id] = { ratingSum: 0, ratingCount: 0, sold: 0 } });

  // Isi data rating
  reviews.forEach((r) => {
    if (productStats[r.product_id]) {
      productStats[r.product_id].ratingSum += r.rating;
      productStats[r.product_id].ratingCount += 1;
    }
  });

  // Isi data sold (terjual)
  orderItems.forEach((item: any) => {
    if (productStats[item.product_id]) {
      productStats[item.product_id].sold += item.quantity;
    }
  });

  const stockData: ProductStockData[] = products.map((p) => {
    const stats = productStats[p.id];
    const avg = stats.ratingCount > 0 ? stats.ratingSum / stats.ratingCount : 0;
    return {
      id: p.id,
      name: p.name,
      stock: p.stock,
      price: p.price,
      // @ts-ignore
      category_name: Array.isArray(p.category) ? p.category[0]?.name : p.category?.name || "Umum",
      rating: parseFloat(avg.toFixed(1)),
      status: p.status,
      items_sold: stats.sold // Data riil penjualan per produk
    };
  });

  // B. Daily Sales
  const dailyMap: Record<string, any> = {};
  orderItems.forEach((item: any) => {
    if (!item.orders) return;
    const date = new Date(item.orders.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    if (!dailyMap[date]) dailyMap[date] = { date, items_sold: 0, revenue: 0 };
    dailyMap[date].items_sold += item.quantity;
    dailyMap[date].revenue += (item.price * item.quantity);
  });

  // C. Region Sales
  const regionMap: Record<string, any> = {};
  orderItems.forEach((item: any) => {
    const region = item.orders?.address?.province?.name;
    if (!region) return;
    if (!regionMap[region]) regionMap[region] = { orders: 0, revenue: 0, products: {} };
    regionMap[region].orders += 1;
    regionMap[region].revenue += (item.price * item.quantity);
    
    const pName = item.products?.name || "Produk";
    if (!regionMap[region].products[pName]) regionMap[region].products[pName] = 0;
    regionMap[region].products[pName] += item.quantity;
  });

  const regionSalesData = Object.entries(regionMap).map(([region, data]: any) => {
    const topProduct = Object.entries(data.products).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "-";
    return { region, totalOrders: data.orders, totalRevenue: data.revenue, topProduct };
  });

  return {
    stockData,
    dailySalesData: Object.values(dailyMap),
    regionSalesData
  };
}