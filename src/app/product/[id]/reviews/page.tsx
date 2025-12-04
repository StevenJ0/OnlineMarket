import Navbar from '../../../../components/navbar';
import FullReviewsFilter from '../../../../components/views/FullReviewsFilter';
import { supabase } from '../../../../lib/supabase/init';

import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';

type Props = { params: Promise<{ id: string }> };

export const revalidate = 0; 

export default async function AllReviewsPage(props: Props) {
    const params = await props.params;
    const id = params.id;

    const { data: product } = await supabase
        .from('products')
        .select('name, price, stock, category:categories(name)')
        .eq('id', id)
        .single();

    const { data: reviews } = await supabase
        .from('product_reviews')
        .select('id, guest_name, rating, comment, created_at')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

    if (!product) {
        return (
             <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                Produk tidak ditemukan
             </div>
        );
    }

    const reviewList = reviews || [];
    const averageRating = reviewList.length > 0 
        ? (reviewList.reduce((acc, curr) => acc + curr.rating, 0) / reviewList.length).toFixed(1)
        : "0.0";

    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(product.price);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 pb-20">
            <div className="fixed top-0 w-full z-50"><Navbar /></div>

            <div className="pt-10 px-4 sm:px-6 max-w-7xl mx-auto">
                
                <div className="mb-8">
                    <Link href={`/product/${id}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-400 transition-colors mb-6 group">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-orange-500/50">
                            <ArrowLeft size={18} />
                        </div>
                        <span className="font-medium text-sm">Kembali ke Produk</span>
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
                        <div>
                            <span className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-2 block">
                                {(product.category as any)?.name || 'Produk'}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h1>
                            <div className="flex items-center gap-4 text-slate-400">
                                <span className="font-semibold text-white text-xl">{formattedPrice}</span>
                                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                <div className="flex items-center gap-1.5">
                                    <Star size={16} fill="#eab308" className="text-yellow-500" />
                                    <span className="text-white font-bold">{averageRating}</span>
                                    <span className="text-xs">({reviewList.length} Ulasan)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <FullReviewsFilter reviews={reviewList} productId={id} />

            </div>
        </main>
    );
}