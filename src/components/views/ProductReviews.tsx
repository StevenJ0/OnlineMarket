"use client";

import { useState } from 'react';
import { Star, User, Send, CheckCircle, Map, ArrowRight } from 'lucide-react';
// Gunakan relative path
import { supabase } from '../../lib/supabase/init';
import Link from 'next/link';

type Review = {
  id?: string;
  guest_name?: string;
  rating: number;
  comment: string;
  created_at?: string;
};

type Province = { id: string; name: string; };

type Props = {
  productId: string;
  productName: string; 
  initialReviews: any[];
  totalReviews: number;
  provinces: Province[];
};

export default function ProductReviews({ productId, productName, initialReviews, totalReviews, provinces }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', rating: 5, comment: '', provinceId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRating = (rate: number) => setFormData({ ...formData, rating: rate });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.provinceId) { alert("Mohon pilih provinsi."); return; }
    setIsSubmitting(true);

    try {
      const payload = {
        product_id: productId, rating: formData.rating, comment: formData.comment,
        guest_name: formData.name, guest_email: formData.email, guest_phone: formData.phone,
        guest_province_id: formData.provinceId, user_id: null
      };

      const { data, error } = await supabase.from('product_reviews').insert(payload).select().single();
      if (error) throw error;

      fetch('/api/review/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.name, productName: productName })
      });

      const newReview: Review = { ...data, guest_name: formData.name };
      setReviews([newReview, ...reviews]);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', rating: 5, comment: '', provinceId: '' });
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim ulasan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="reviews">
      {/* [PERBAIKAN RESPONSIVE] 
          Gunakan flex-col untuk mobile (menurun) dan sm:flex-row untuk tablet ke atas (menyamping).
          Tambahkan gap-4 agar ada jarak saat menurun. 
      */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
            <h3 className="text-xl sm:text-2xl font-bold text-white">Ulasan Pembeli</h3>
            <div className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold shrink-0">
                {totalReviews} Total
            </div>
        </div>
        
        {totalReviews > 5 && (
            <Link 
                href={`/product/${productId}/reviews`}
                className="text-orange-500 hover:text-orange-400 text-sm font-semibold flex items-center gap-1 transition-colors self-start sm:self-auto"
            >
                Lihat Semua Ulasan <ArrowRight size={16} />
            </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* --- LIST ULASAN --- */}
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-10 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                Belum ada ulasan. Jadilah yang pertama!
              </div>
            ) : (
              reviews.map((rev, idx) => (
                <div key={idx} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60">
                   <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{rev.guest_name || "Guest"}</p>
                        {rev.created_at && (<p className="text-xs text-slate-500">{new Date(rev.created_at).toLocaleDateString("id-ID")}</p>)}
                      </div>
                    </div>
                    <div className="flex gap-0.5 shrink-0"><Star size={12} className="text-yellow-500" fill="#eab308"/> <span className="text-xs ml-1 text-slate-300">{rev.rating}</span></div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed pl-[52px]">{rev.comment}</p>
                </div>
              ))
            )}
            
            {totalReviews > 5 && (
                 <Link href={`/product/${productId}/reviews`} className="block w-full text-center py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-sm font-medium mt-4">
                    Lihat {totalReviews - 5} ulasan lainnya...
                 </Link>
            )}
          </div>
        </div>

        {/* --- FORM INPUT --- */}
        <div className="lg:col-span-5 order-1 lg:order-2">
             <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
                 {isSuccess ? (
                    <div className="text-emerald-400 text-center py-10">
                        <CheckCircle size={48} className="mx-auto mb-3"/>
                        Terima kasih! Ulasan terkirim.
                    </div>
                 ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="text-center mb-4"><p className="text-white font-bold">Tulis Ulasan</p></div>
                         <div className="flex justify-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} type="button" onClick={() => handleRating(star)} className="focus:outline-none hover:scale-110 transition-transform">
                                <Star size={24} fill={formData.rating >= star ? "#eab308" : "none"} className={formData.rating >= star ? 'text-yellow-500' : 'text-slate-700'} />
                              </button>
                            ))}
                        </div>
                        <input required name="name" placeholder="Nama" value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white text-sm"/>
                        <div className="grid grid-cols-2 gap-3">
                            <input required name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white text-sm"/>
                            <input required name="phone" placeholder="No HP" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white text-sm"/>
                        </div>
                        
                        <div className="relative">
                            <select required name="provinceId" value={formData.provinceId} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white text-sm appearance-none">
                                <option value="">Pilih Provinsi Asal</option>
                                {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <Map size={16} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none"/>
                        </div>

                        <textarea required name="comment" rows={3} placeholder="Ceritakan pengalamanmu..." value={formData.comment} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-white text-sm"/>
                        
                        <button disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-lg shadow-lg">
                            {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                        </button>
                    </form>
                 )}
             </div>
        </div>
      </div>
    </div>
  );
}