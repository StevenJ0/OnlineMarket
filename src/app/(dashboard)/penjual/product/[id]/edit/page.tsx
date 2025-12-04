import ProductFormView, { ProductFormValues } from "@/components/views/ProductFormView";
// Ubah import dari getDataByColumn menjadi RetrieveDataByField sesuai service.ts Anda
import { RetrieveDataByField } from "@/lib/supabase/service";

type PageProps = {
  params: { id: string };
};

export default async function EditProductPage({ params }: PageProps) {
  // Gunakan RetrieveDataByField dengan objek filter { id: params.id }
  const { data: products, error } = await RetrieveDataByField("products", { id: params.id });

  // Karena RetrieveDataByField mengembalikan array, kita ambil item pertama
  const productData = products && products.length > 0 ? products[0] : null;

  if (error) {
    console.error("Error fetching product:", error);
  }

  // Map DB row to ProductFormValues expected by the form component
  // Pastikan field sesuai dengan database Anda (name, price, stock, description)
  const initialValues: ProductFormValues = productData
    ? {
        name: productData.name ?? "",
        price: productData.price != null ? String(productData.price) : "",
        stock: productData.stock != null ? String(productData.stock) : "",
        description: productData.description ?? "",
        // category: productData.category_id ?? "", // Jika nanti form butuh kategori
      }
    : {
        name: "",
        price: "",
        stock: "",
        description: "",
      };

  return <ProductFormView mode="edit" initialValues={initialValues} />;
}