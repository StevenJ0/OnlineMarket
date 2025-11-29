import { supabase } from '@/lib/supabase/supabaseClient';

export type ProductDetail = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: { name: string } | null;
  seller: {
    store_name: string;
    kota: string;      
    provinsi: string;  
  } | null;
  images: { image_url: string; is_primary: boolean }[];
  reviews: { rating: number; comment: string }[];
};

export class ProductModel {
  async getProductById(id: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, description, price, stock,
          category:categories(name),
          seller:sellers(
            store_name,
            kota,    
            provinsi 
          ),
          images:product_images(image_url, is_primary),
          reviews:product_reviews(rating, comment)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error("❌ Supabase Error Detail:", error);
        return null;
      }

      return data as any;
    } catch (error) {
      console.error("❌ System Error:", error);
      return null;
    }
  }
}