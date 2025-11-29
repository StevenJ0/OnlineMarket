import { ProductController } from '@/controllers/ProductController';
import Navbar from '@/components/navbar'; 
import ProductGallery from '@/components/views/ProductGallery';
import Link from 'next/link';
import { MapPin, ShoppingCart, Star, Store, ArrowLeft, Share2, Shield, Truck, RotateCcw } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage(props: Props) {
  const params = await props.params;
  const id = params.id;
  
  const controller = new ProductController();
  const product = await controller.show(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <Store size={32} className="text-slate-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Produk Tidak Ditemukan</h1>
          <p className="text-slate-400 mb-8">Maaf, produk yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl hover:from-orange-500 hover:to-orange-400 transition font-semibold shadow-lg shadow-orange-600/20">
            <ArrowLeft size={18} />
            Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 pb-32">
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      
      <div className="pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <nav className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-all group">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 group-hover:border-orange-500/50 group-hover:bg-slate-900 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-medium">Kembali ke Katalog</span>
          </Link>
          <button className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:text-orange-400 hover:border-orange-500/50 hover:bg-slate-900 transition-all">
            <Share2 size={18} />
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-7">
            <ProductGallery 
              images={product.images} 
              productName={product.name} 
              categoryName={product.categoryName} 
            />
          </div>

          <div className="lg:col-span-5 flex flex-col">
            
            <div className="mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {product.categoryName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800/60">
              <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <Star size={16} fill="#eab308" className="text-yellow-500" />
                <span className="text-sm font-bold text-white">{product.rating}</span>
              </div>
              <span className="text-sm text-slate-400">{product.totalReviews} Ulasan</span>
              <span className="text-xs text-slate-600">•</span>
              <span className="text-sm text-slate-400">Terjual 50+</span>
            </div>

            <div className="mb-6">
              <p className="text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">Harga Terbaik</p>
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
                {product.price}
              </span>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 mb-6 hover:bg-slate-900/70 hover:border-slate-700 transition-all cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0 mt-1">
                  {product.storeName.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-white truncate text-base">{product.storeName}</h3>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      
                      <span className="self-start sm:self-auto flex-shrink-0 px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20 uppercase tracking-wide">
                        Mall
                      </span>
                      
                      <div className="flex items-center text-xs text-slate-400 min-w-0">
                        <MapPin size={12} className="mr-1.5 text-orange-500 flex-shrink-0" />
                        <span className="truncate">{product.storeLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all shrink-0 self-center">
                  Kunjungi
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                Deskripsi Produk
              </h3>
              <div className="text-slate-400 text-sm leading-relaxed bg-slate-900/30 p-4 rounded-xl border border border-slate-800/50">
                <p className="whitespace-pre-line">
                  {product.description || "Tidak ada deskripsi tersedia untuk produk ini."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 shadow-2xl z-40 animate-fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            
            <div className="hidden md:flex flex-col">
              <span className="text-xs text-slate-500 font-medium mb-0.5">Total Harga</span>
              <span className="text-2xl font-bold text-white">{product.price}</span>
            </div>
            
            <div className="grid grid-cols-2 md:flex md:flex-1 md:justify-end gap-3 w-full md:w-auto">
              
              <button className="h-12 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500 transition-all active:scale-95 md:w-auto md:px-6">
                <ShoppingCart size={18} />
                <span className="font-semibold text-sm">Keranjang</span>
              </button>
              
              <button className="h-12 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 md:w-52">
                <span className="text-sm sm:text-base">Beli Sekarang</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}