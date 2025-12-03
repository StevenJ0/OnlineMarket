import Navbar from '../../../components/navbar'; 
import ProductGallery from '../../../components/views/ProductGallery';
import ProductReviews from '../../../components/views/ProductReviews';
import PurchaseButtons from '../../../components/views/PurchaseButtons'; 

import Link from 'next/link'; 
import { Metadata } from 'next';

import { supabase } from '../../../lib/supabase/init';
import { Star, Store, ArrowLeft, Share2, Package, MapPin } from 'lucide-react';

async function getProductData(id: string) {
  try {
    const productQuery = supabase
      .from('products')
      .select(`
        id, name, description, price, stock,
        category:categories(name),
        seller:sellers (
            store_name,
            city:cities (name),       
            province:provinces (name) 
        ),
        images:product_images(image_url)
      `)
      .eq('id', id)
      .single();

    const reviewsQuery = supabase
      .from('product_reviews')
      .select('rating, comment, guest_name, created_at')
      .eq('product_id', id)
      .order('created_at', { ascending: false })
      .limit(5);

    const countQuery = supabase
      .from('product_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', id);

    const [productRes, reviewsRes, countRes] = await Promise.all([
        productQuery, 
        reviewsQuery,
        countQuery
    ]);

    if (productRes.error) {
        console.error("Supabase Error (Product):", productRes.error.message);
        return null;
    }
    if (!productRes.data) return null;

    const data = productRes.data;
    const initialReviews = reviewsRes.data || [];
    const totalReviews = countRes.count || 0;

    const rawSeller: any = data.seller;
    const rawCategory: any = data.category;

    const sellerData = Array.isArray(rawSeller) ? rawSeller[0] : rawSeller;
    const categoryData = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory;

    const cityName = sellerData?.city?.name; 
    const provinceName = sellerData?.province?.name;

    let storeLocation = "Lokasi Tidak Diketahui";
    if (cityName && provinceName) {
        storeLocation = `${cityName}, ${provinceName}`;
    } else if (cityName) {
        storeLocation = cityName;
    }

    const storeName = sellerData?.store_name || 'Toko Tanpa Nama';
    const categoryName = categoryData?.name || 'Umum';

    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(data.price);

    const averageRating = initialReviews.length > 0
        ? (initialReviews.reduce((sum, item) => sum + item.rating, 0) / initialReviews.length).toFixed(1)
        : "0.0";

    return {
      id: data.id, name: data.name, description: data.description,
      price: formattedPrice, rawPrice: data.price, 
      stock: data.stock,
      categoryName: categoryName,
      storeName: storeName, storeLocation: storeLocation, images: data.images || [],
      rating: averageRating, 
      totalReviews: totalReviews, 
      reviews: initialReviews
    };
  } catch (err) {
    console.error("System Error (Product):", err);
    return null;
  }
}

async function getProvinces() {
    try {
        const { data, error } = await supabase.from('provinces').select('id, name').order('name', { ascending: true });
        return data || [];
    } catch (err) { return []; }
}

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductData(id);
  if (!product) return { title: 'Produk Tidak Ditemukan' };
  return { title: `${product.name} | MarketPlace`, description: product.description?.slice(0, 150) };
}

export default async function ProductDetailPage(props: Props) {
  const params = await props.params;
  const id = params.id;

  const [product, provinces] = await Promise.all([
    getProductData(id),
    getProvinces()
  ]);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Store size={32} className="text-slate-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-3">Produk Tidak Ditemukan</h1>
          <p className="text-slate-400 mb-6">Mungkin produk telah dihapus atau ID salah.</p>
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
                
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-slate-800/60">
                    <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                        <Star size={16} fill="#eab308" className="text-yellow-500" />
                        <span className="text-sm font-bold text-white">{product.rating}</span>
                    </div>
                    <span className="text-sm text-slate-400 border-r border-slate-800 pr-4">{product.totalReviews} Ulasan</span>
                    
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium
                        ${product.stock > 0 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                    >
                        <Package size={16} />
                        <span>{product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}</span>
                    </div>
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
                        {/* Lokasi Toko yang sudah diambil dari relasi cities & provinces */}
                        <span className="truncate">{product.storeLocation}</span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 text-sm leading-relaxed bg-slate-900/30 p-5 rounded-xl border border-slate-800/50">
                    <p className="whitespace-pre-line">{product.description || "Tidak ada deskripsi."}</p>
                </div>
            </div>
        </div>
        
        <hr className="border-slate-800/60 my-12" />

        <div className="w-full">
           <ProductReviews 
                productId={id} 
                productName={product.name}
                initialReviews={product.reviews || []} 
                totalReviews={product.totalReviews}
                provinces={provinces}
            />
        </div>
      </div>

      <PurchaseButtons price={product.price} stock={product.stock || 0} />
    </main>
  );
}