import ProductFormView, { ProductFormValues } from "@/components/views/ProductFormView";
import { getDataByColumn } from "@/lib/supabase/service";

type PageProps = {
  params: { id: string };
};

export default async function EditProductPage({ params }: PageProps) {
  // Try to fetch product data from Supabase by id (server-side)
  const { data: productData, error } = await getDataByColumn("products", "id", params.id);

  // Map DB row to ProductFormValues expected by the form component
  const initialValues: ProductFormValues = productData
    ? {
        name: productData.name ?? "",
        price: productData.price != null ? String(productData.price) : "",
        stock: productData.stock != null ? String(productData.stock) : "",
        description: productData.description ?? "",
      }
    : {
        name: "",
        price: "",
        stock: "",
        description: "",
      };

  return <ProductFormView mode="edit" initialValues={initialValues} />;
}
