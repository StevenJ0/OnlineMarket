"use client";

import { useState } from 'react';
import { ShoppingCart, X, Info } from 'lucide-react';

type Props = {
  price: string;
  stock: number;
};

export default function PurchaseButtons({ price, stock }: Props) {
  const [showPopup, setShowPopup] = useState(false);

  const handleAction = () => {
    setShowPopup(true);
  };

  const isOutOfStock = stock <= 0;

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          
          <div className="hidden md:flex flex-col">
            <span className="text-xs text-slate-500 font-medium mb-0.5">Total Harga</span>
            <span className="text-2xl font-bold text-white">{price}</span>
          </div>

          <div className="flex flex-1 md:justify-end gap-3 w-full md:w-auto">
            <button 
              onClick={handleAction}
              disabled={isOutOfStock}
              className={`h-12 px-6 flex items-center justify-center gap-2 rounded-xl border-2 font-semibold text-sm w-full md:w-auto transition-all
                ${isOutOfStock 
                  ? 'border-slate-800 bg-slate-900 text-slate-600 cursor-not-allowed' 
                  : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
            >
              <ShoppingCart size={18} /> Keranjang
            </button>
            
            <button 
              onClick={handleAction}
              disabled={isOutOfStock}
              className={`h-12 px-8 font-bold rounded-xl shadow-lg flex items-center justify-center transition-all w-full md:w-auto
                ${isOutOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white'
                }`}
            >
              {isOutOfStock ? "Stok Habis" : "Beli Sekarang"}
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mb-4 text-orange-500">
                <Info size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Fitur Belum Tersedia</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Mohon maaf, fitur pembayaran dan keranjang saat ini belum tersedia. 
                Mohon bersabar menunggu pembaruan selanjutnya yaa! 😊
              </p>

              <button 
                onClick={() => setShowPopup(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition-colors"
              >
                Mengerti
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}