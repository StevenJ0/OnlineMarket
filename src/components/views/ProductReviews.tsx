"use client";

import { useState } from 'react';
import { Star, User, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/init';

type Review = {
  id?: string;
  guest_name?: string;
  user_id?: string;
  rating: number;
  comment: string;
  created_at?: string;
};

type Props = {
  productId: string;
  initialReviews: any[];
};

export default function ProductReviews({ productId, initialReviews }: Props) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', rating: 5, comment: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (rate: number) => {
    setFormData({ ...formData, rating: rate });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        product_id: productId,
        rating: formData.rating,
        comment: formData.comment,
        guest_name: formData.name,   
        guest_email: formData.email,
        guest_phone: formData.phone,
        user_id: null
      };

      const { data, error } = await supabase
        .from('product_reviews')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      const newReview: Review = { ...data, guest_name: formData.name };
      setReviews([newReview, ...reviews]);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', rating: 5, comment: '' });
      }, 3000);

    } catch (error) {
      alert("Gagal mengirim ulasan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="reviews">
      <div className="flex items-center gap-3 mb-8">
        <h3 className="text-2xl font-bold text-white">Ulasan Pembeli</h3>
        <div className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
           {reviews.length} Total
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-900/30 rounded-2xl border border-dashed border-slate-800 text-slate-500">
                <Star size={32} className="mb-3 opacity-20" />
                <p>Belum ada ulasan untuk produk ini.</p>
              </div>
            ) : (
              reviews.map((rev, idx) => (
                <div key={idx} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 hover:border-slate-700 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{rev.guest_name || "Guest"}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < rev.rating ? "#eab308" : "none"} className={i < rev.rating ? "text-yellow-500" : "text-slate-700"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed pl-[52px]">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-5 order-1 lg:order-2">
          <div className="sticky top-20 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-sm">
            <h4 className="font-bold text-white mb-1 text-lg">Tulis Ulasan</h4>
            <p className="text-slate-400 text-sm mb-6">Bagikan pengalaman belanja Anda disini.</p>
            
            {isSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-xl flex flex-col items-center justify-center gap-3 text-center min-h-[300px]">
                <CheckCircle size={48} className="animate-bounce" />
                <div>
                  <p className="font-bold text-lg">Terima Kasih!</p>
                  <p className="text-sm opacity-80">Ulasan Anda telah kami terima.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50 text-center">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Beri Penilaian</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => handleRating(star)} className="focus:outline-none hover:scale-110 transition-transform">
                        <Star size={28} fill={formData.rating >= star ? "#eab308" : "none"} className={formData.rating >= star ? 'text-yellow-500' : 'text-slate-700'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <input required name="name" placeholder="Nama Lengkap" value={formData.name} onChange={handleChange} 
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition outline-none" />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input required type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} 
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition outline-none" />
                    <input required name="phone" placeholder="No. HP" value={formData.phone} onChange={handleChange} 
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition outline-none" />
                  </div>
                </div>

                <textarea required name="comment" rows={4} placeholder="Tulis ulasan Anda..." value={formData.comment} onChange={handleChange} 
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition outline-none resize-none" />

                <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                  {isSubmitting ? "Mengirim..." : <>Kirim Ulasan <Send size={16} /></>}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}