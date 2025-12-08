"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductFormView, { ProductFormValues } from "@/components/views/ProductFormView"; 

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;

  console.log("Product ID:", id);

  const [productData, setProductData] = useState<(ProductFormValues & { category_id?: string, status?: string }) | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [initialPrimaryIndex, setInitialPrimaryIndex] = useState<number>(0); // State baru untuk index gambar utama
  const [loading, setLoading] = useState(true);

  const getProductByProductId = async (productId: string) => {

    try {
      setLoading(true);
      const res = await fetch('/api/penjual/product?productId=' + productId, {
        method: 'GET',
        credentials: 'include', 
      });
      
      const data = await res.json();
      
      if (data.success && data.product) {
        setProductData({
            name: data.product.name, 
            price: data.product.price.toString(), 
            stock: data.product.stock.toString(),
            description: data.product.description || "", 
            category_id: data.product.category_id, 
            status: data.product.status,          
        });
        if (data.product.product_images && Array.isArray(data.product.product_images)) {
            const urls = data.product.product_images.map((img: any) => img.image_url);
            setExistingImages(urls);
            const foundIndex = data.product.product_images.findIndex((img: any) => img.is_primary);
            if (foundIndex !== -1) {
                setInitialPrimaryIndex(foundIndex);
            }
        }
      }
    } catch (error) {
        console.error("Gagal mengambil data produk:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getProductByProductId(id);
    }
  }, [id]);

  if (loading) {
    return (
        <div className="min-h-screen bg-[#050815] flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-t-[#ff7a1a] border-slate-700 rounded-full animate-spin"></div>
                <p>Memuat data produk...</p>
            </div>
        </div>
    );
  }

  return (
    <div>
      <ProductFormView 
        mode="edit" 
        initialValues={productData || undefined} 
        initialImages={existingImages} 
        initialPrimaryIndex={initialPrimaryIndex}
        productId={id}
      />
    </div>
  );
}