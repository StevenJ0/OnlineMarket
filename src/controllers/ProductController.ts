import { ProductModel } from '@/models/ProductModel';

export class ProductController {
  private model: ProductModel;

  constructor() {
    this.model = new ProductModel();
  }

  async show(id: string) {
    const rawData = await this.model.getProductById(id);

    if (!rawData) return null;

    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(rawData.price);

    const storeLocation = rawData.seller?.kota 
      ? `${rawData.seller.kota}, ${rawData.seller.provinsi}`
      : "Lokasi Tidak Diketahui";

    // Hitung Rating
    const reviews = rawData.reviews || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum: number, rev: any) => sum + rev.rating, 0) / totalReviews
      : 0;

    return {
      id: rawData.id,
      name: rawData.name,
      description: rawData.description,
      price: formattedPrice,
      rawPrice: rawData.price,
      stock: rawData.stock,
      categoryName: rawData.category?.name || 'Umum',
      storeName: rawData.seller?.store_name || 'Toko Tidak Dikenal',
      storeLocation: storeLocation,
      images: rawData.images || [],
      rating: averageRating.toFixed(1),
      totalReviews: totalReviews,
      reviews: reviews
    };
  }
}