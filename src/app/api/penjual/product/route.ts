import { RetrieveDataByField, addData, updateData, uploadFile } from "@/lib/supabase/service";
import { withAuth } from "@/utils/withAuth";
import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase/init";

export const GET = withAuth(async (request: Request) => {
  console.log("API GET /penjual/product dipanggil");
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");
    const productId = searchParams.get("productId");

    if (productId) {
      const { data: productData, error: productErr } = await supabase
        .from("products")
        .select(`
            *,
            product_images (
              id,
              image_url,
              is_primary
            )
        `)
        .eq("id", productId);

      if (productErr || !productData?.length) {
        return NextResponse.json(
          { success: false, message: "Produk tidak ditemukan" },
          { status: 404 }
        );
      }

      const rawProduct = productData[0];

      const formattedProduct = {
        ...rawProduct,
        images: rawProduct.product_images 
          ? rawProduct.product_images.map((img: any) => img.image_url)
          : [],      
        raw_images : rawProduct.product_images || [],
        }

        console.log("formattedProduct:", formattedProduct);
      return NextResponse.json(
        { success: true, product: formattedProduct },
        { status: 200 }
      );
    }

    if (storeId) {
      console.log("Ambil produk berdasarkan storeId:", storeId);

      const { data: products, error: productsErr } = await supabase
        .from("products")
        .select("*, categories(*), product_reviews(rating)")
        .eq("seller_id", storeId);

      if (productsErr) {
        return NextResponse.json(
          { success: false, message: "Failed to retrieve products" },
          { status: 500 }
        );
      }

      const productsWithRating = products.map((product: any) => {
        const reviews = product.product_reviews || [];
        const totalRating = reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0);
        const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "0.0";
        
        return {
            ...product,
            rating: parseFloat(avgRating) 
        };
      });

      return NextResponse.json(
        { success: true, products : productsWithRating },
        { status: 200 }
      );
    }

    // --- FIX: Return default jika tidak ada parameter
    return NextResponse.json(
      { success: false, message: "Parameter userId atau productId harus disertakan" },
      { status: 400 }
    );

  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to retrieve products" },
      { status: 500 }
    );
  }
}, ["seller"]);


export const POST = withAuth(async (req: Request, user: any) => {
  try {
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json(
        { success: false, message: "Missing storeId parameter" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const receivedData: Record<string, any> = {};
    const receivedFiles: File[] = [];

    formData.forEach((value, key) => {
      if (value instanceof File) {
        if (key === "images") receivedFiles.push(value);
      } else {
        receivedData[key] = value;
      }
    });

    if (!receivedData.name) {
      return NextResponse.json(
        { success: false, message: "Nama produk wajib diisi" },
        { status: 400 }
      );
    }

    if (!receivedData.price) {
      return NextResponse.json(
        { success: false, message: "Harga produk wajib diisi" },
        { status: 400 }
      );
    }

    if (!receivedData.stock) {
      return NextResponse.json(
        { success: false, message: "Stok produk wajib diisi" },
        { status: 400 }
      );
    }

    if (!receivedData.category_id) {
      return NextResponse.json(
        { success: false, message: "Kategori produk wajib dipilih" },
        { status: 400 }
      );
    }

    if (receivedFiles.length === 0) {
      return NextResponse.json(
        { success: false, message: "Minimal 1 gambar produk harus diupload" },
        { status: 400 }
      );
    }

    const imageUrls: string[] = [];

    for (const file of receivedFiles) {
      const filePath = `product/${storeId}/${Date.now()}_${file.name}`;
      const { url, error } = await uploadFile("product", filePath, file);

      if (error || !url) {
        return NextResponse.json(
          { success: false, message: "Gagal upload file" },
          { status: 500 }
        );
      }

      imageUrls.push(url);
    }

    console.log("sudah upload images:", imageUrls);

    const { data: newProduct, error: productErr } = await addData("products", {
      seller_id: storeId,
      category_id: receivedData.category_id,
      name: receivedData.name,
      description: receivedData.description || "",
      price: parseFloat(receivedData.price),
      stock: parseInt(receivedData.stock),
      status: receivedData.status || "active",
    });

    if (productErr || !newProduct) {
      return NextResponse.json(
        { success: false, message: "Gagal menambahkan produk baru" },
        { status: 500 }
      );
    }

    console.log("newProduct:", newProduct);
    console.log("receivedData.primaryIndex:", receivedData.primaryIndex);

    const product = newProduct?.[0];

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Gagal menambahkan produk baru" },
        { status: 500 }
      );
    }

    for (let i = 0; i < imageUrls.length; i++) {
      await addData("product_images", {
        product_id: product.id,
        image_url: imageUrls[i],
        is_primary: i === parseInt(receivedData.primaryIndex || "0"),
      });
    }

    console.log("Sukses menambahkan produk dan gambar");

    return NextResponse.json(
      { success: true, message: "Produk berhasil ditambahkan" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memproses request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}, ["seller", "admin"]);


export const PUT = withAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const storeId = searchParams.get("storeId");

    if (!productId || !storeId) {
      return NextResponse.json({ success: false, message: "Missing params" }, { status: 400 });
    }

    // 2. Parse Form Data
    const formData = await req.formData();
    // ... ambil name, price, stock, description, category_id, status ...
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const stock = formData.get("stock") as string;
    const description = formData.get("description") as string;
    const category_id = formData.get("category_id") as string;
    const status = formData.get("status") as string;
    const primaryIndex = parseInt((formData.get("primaryIndex") as string) || "0");

    // 3. Update Text Data (Tabel Products)
    const { error: updateErr } = await supabaseAdmin
      .from("products")
      .update({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category_id,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (updateErr) return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });


    let finalImageUrls: string[] = [];

    const existingImagesJson = formData.get("existingImages") as string;
    if (existingImagesJson) {
      try {
        const parsedOld = JSON.parse(existingImagesJson);
        if (Array.isArray(parsedOld)) finalImageUrls = parsedOld;
      } catch (e) { console.error(e); }
    }

    const newFiles = formData.getAll("images") as File[];
    if (newFiles && newFiles.length > 0) {
      for (const file of newFiles) {
        if (file instanceof File && file.size > 0) {
           const filePath = `product/${storeId}/${Date.now()}_${file.name}`;
           const { url, error } = await uploadFile("product", filePath, file);
           
           if (!error && url) {
             finalImageUrls.push(url); 
           }
        }
      }
    }

    // Validasi minimal 1 gambar
    if (finalImageUrls.length === 0) {
       return NextResponse.json({ success: false, message: "Minimal 1 gambar" }, { status: 400 });
    }

    const { error: deleteImgErr } = await supabaseAdmin
      .from("product_images")
      .delete()
      .eq("product_id", productId);

    if (deleteImgErr) return NextResponse.json({ success: false, error: deleteImgErr.message }, { status: 500 });


    const imagePayloads = finalImageUrls.map((url, index) => ({
      product_id: productId,
      image_url: url,
      is_primary: index === primaryIndex, // Logic primary index bekerja sempurna disini
    }));

    // Bulk Insert (Sekali jalan)
    const { error: insertImgErr } = await supabaseAdmin
      .from("product_images")
      .insert(imagePayloads);

    if (insertImgErr) return NextResponse.json({ success: false, error: insertImgErr.message }, { status: 500 });

    return NextResponse.json({ success: true, message: "Berhasil update" }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}, ["seller", "admin"]);

export const DELETE = withAuth(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const storeId = searchParams.get("storeId");

    console.log("DELETE /penjual/product dipanggil dengan productId:", productId, "storeId:", storeId);

    if (!productId || !storeId) {
      return NextResponse.json({ success: false, message: "Missing params" }, { status: 400 });
    }

    const { data: productCheck, error: checkErr } = await supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .eq("seller_id", storeId)
      .single();

    if (checkErr || !productCheck) {
      return NextResponse.json({ success: false, message: "Akses ditolak atau produk tidak ditemukan" }, { status: 403 });
    }

    console.log(`HARD DELETE: Menghapus produk ${productId}`);

    const { data: images } = await supabaseAdmin
      .from("product_images")
      .select("image_url")
      .eq("product_id", productId);

    const deleteDependencies = [
      supabaseAdmin.from("cart_items").delete().eq("product_id", productId),     
      supabaseAdmin.from("product_reviews").delete().eq("product_id", productId),
      supabaseAdmin.from("product_images").delete().eq("product_id", productId),
      supabaseAdmin.from("order_items").delete().eq("product_id", productId),
    ];

    await Promise.all(deleteDependencies);

    const { error: deleteProductErr } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteProductErr) {
      throw new Error("Gagal menghapus produk: " + deleteProductErr.message);
    }

    if (images && images.length > 0) {
        const pathsToDelete = images.map((img) => {
            const url = img.image_url;
            if (url.includes("/product/")) {
                return url.split("/product/")[1]; 
            }
            return null;
        }).filter(Boolean); 

        if (pathsToDelete.length > 0) {
             await supabaseAdmin.storage.from("product").remove(pathsToDelete as string[]);
        }
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus permanen (Hard Delete).",
    });

  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}, ["seller", "admin"]);