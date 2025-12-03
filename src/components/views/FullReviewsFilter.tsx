"use client";

import { useState } from 'react';
import { Star, User, Filter, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Review = {
    id: string;
    guest_name: string;
    rating: number;
    comment: string;
    created_at: string;
};

type Props = {
    reviews: Review[];
    productId: string;
};

export default function FullReviewsFilter({ reviews, productId }: Props) {
    const [filterRating, setFilterRating] = useState<number | 'all'>('all');

    // Logic Filtering
    const filteredReviews = filterRating === 'all' 
        ? reviews 
        : reviews.filter(r => r.rating === filterRating);

    const countByRating = (star: number) => reviews.filter(r => r.rating === star).length;

    return (
        <div className="max-w-4xl mx-auto">

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8 top-24 backdrop-blur-md z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Semua Ulasan</h2>
                        <p className="text-slate-400 text-sm">Menampilkan {filteredReviews.length} dari {reviews.length} ulasan</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setFilterRating('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border
                            ${filterRating === 'all' 
                                ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20' 
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
                            }`}
                    >
                        <Filter size={14} /> Semua
                    </button>

                    {[5, 4, 3, 2, 1].map((star) => (
                        <button 
                            key={star}
                            onClick={() => setFilterRating(star)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 border
                                ${filterRating === star 
                                    ? 'bg-slate-800 border-yellow-500/50 text-white shadow-lg' 
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
                                }`}
                        >
                            <Star size={14} fill={filterRating === star ? "#eab308" : "currentColor"} className={filterRating === star ? "text-yellow-500" : ""} />
                            {star}
                            <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px] ml-1 opacity-60">
                                {countByRating(star)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4 min-h-[400px]">
                {filteredReviews.length === 0 ? (
                    <div className="text-center py-16 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl">
                        <Star size={48} className="mx-auto text-slate-700 mb-4" />
                        <h3 className="text-lg font-medium text-white">Tidak ada ulasan</h3>
                        <p className="text-slate-500">Belum ada ulasan dengan bintang {filterRating} ini.</p>
                        <button onClick={() => setFilterRating('all')} className="mt-4 text-orange-500 hover:underline">Lihat semua ulasan</button>
                    </div>
                ) : (
                    filteredReviews.map((rev, idx) => (
                        <div key={idx} className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 hover:border-slate-700 transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-300 shadow-inner">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-sm">{rev.guest_name || "Pengunjung"}</p>
                                        <p className="text-xs text-slate-500">
                                            {rev.created_at ? new Date(rev.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 items-center gap-1">
                                    <Star size={14} fill="#eab308" className="text-yellow-500" />
                                    <span className="font-bold text-white text-sm">{rev.rating}</span>
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed pl-[52px] border-l-2 border-slate-800 ml-5 py-1">
                                {rev.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}