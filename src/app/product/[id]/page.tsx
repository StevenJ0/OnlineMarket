import Navbar from '@/components/navbar'; 
import ProductGallery from '@/components/views/ProductGallery';
import ProductReviews from '@/components/views/ProductReviews';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/init';
import { MapPin, ShoppingCart, Star, Store, ArrowLeft, Share2 } from 'lucide-react';
import { Metadata } from 'next';

async function getProductData(id: string) {
  console.log(id)
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, description, price, stock,
        category:categories(name),
        seller:sellers(store_name, city_id , province_id),
        images:product_images(image_url),
        reviews:product_reviews(rating, comment, guest_name, created_at)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    const rawSeller: any = data.seller;
    const rawCategory: any = data.category;
    const sellerData = Array.isArray(rawSeller) ? rawSeller[0] : rawSeller;
    const categoryData = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;

    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(data.price);

    const storeLocation = sellerData?.kota ? `${sellerData.kota}, ${sellerData.provinsi}` : "Lokasi Tidak Diketahui";
    const storeName = sellerData?.store_name || 'Toko Tanpa Nama';
    const categoryName = categoryData?.name || 'Umum';

    const reviews = data.reviews || [];
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum: number, rev: any) => sum + rev.rating, 0) / totalReviews : 0;

    return {
      id: data.id, name: data.name, description: data.description,
      price: formattedPrice, rawPrice: data.price, categoryName: categoryName,
      storeName: storeName, storeLocation: storeLocation, images: data.images || [],
      rating: averageRating.toFixed(1), totalReviews: totalReviews, reviews: reviews
    };
  } catch (err) {
    console.error("System Error:", err);
    return null;
  }
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  console.log("Generating metadata for product ID:", id);
  const product = await getProductData(id);
  console.log("Product data for metadata:", product);
  if (!product) return { title: 'Produk Tidak Ditemukan' };
  return { title: `${product.name} | MarketPlace`, description: product.description?.slice(0, 150) };
}

export default async function ProductDetailPage(props: Props) {
  const params = await props.params;
  const id = params.id;
  const product = await getProductData(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Store size={32} className="text-slate-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-3">Produk Tidak Ditemukan</h1>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 rounded-xl hover:bg-orange-500 transition">
            <ArrowLeft size={18} /> Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 pb-32">
      <div className="fixed top-0 w-full z-50"><Navbar /></div>
      
      <div className="pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <nav className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-all">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800"><ArrowLeft size={18} /></div>
            <span className="text-sm font-medium">Kembali</span>
          </Link>
          <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-orange-400 transition-all"><Share2 size={18} /></button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
          
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} categoryName={product.categoryName} />
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">{product.categoryName}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800/60">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Star size={16} fill="#eab308" className="text-yellow-500" />
                <span className="text-sm font-bold text-white">{product.rating}</span>
              </div>
              <span className="text-sm text-slate-400">{product.totalReviews} Ulasan</span>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">{product.price}</span>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 mb-8 hover:bg-slate-900/70 transition-all cursor-pointer flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0">
                {product.storeName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white truncate text-base">{product.storeName}</h3>
                <div className="flex items-center text-xs text-slate-400 mt-1">
                    <MapPin size={12} className="mr-1 text-orange-500" />
                    <span className="truncate">{product.storeLocation}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-3">Deskripsi Produk</h3>
              <div className="text-slate-400 text-sm leading-relaxed bg-slate-900/30 p-5 rounded-xl border border-slate-800/50">
                <p className="whitespace-pre-line">{product.description || "Tidak ada deskripsi tersedia."}</p>
              </div>
            </div>
            
          </div>
        </div>
        
        <hr className="border-slate-800/60 my-12" />

        <div className="w-full">
           <ProductReviews productId={id} initialReviews={product.reviews || []} />
        </div>

      </div>

      <div className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="hidden md:flex flex-col">
            <span className="text-xs text-slate-500 font-medium mb-0.5">Total Harga</span>
            <span className="text-2xl font-bold text-white">{product.price}</span>
          </div>
          <div className="flex flex-1 md:justify-end gap-3 w-full md:w-auto">
            <button className="h-12 px-6 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800 transition-all font-semibold text-sm w-full md:w-auto">
              <ShoppingCart size={18} /> Keranjang
            </button>
            <button className="h-12 px-8 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-xl shadow-lg flex items-center justify-center transition-all w-full md:w-auto">
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}