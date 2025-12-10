"use client";

import { useState } from "react";

type ProductGalleryProps = {
  images: { image_url: string; is_primary?: boolean }[];
  productName: string;
  categoryName: string;
};

export default function ProductGallery({ images, productName, categoryName }: ProductGalleryProps) {
  const primaryImage = images.find((img) => img.is_primary);
  const initialImage = primaryImage?.image_url || images[0]?.image_url || "";
  const [activeImage, setActiveImage] = useState(initialImage);

  if (images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
          <span className="text-slate-600">No Image</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-[4/3] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 relative group shadow-2xl">
        <img
          src={activeImage}
          alt={productName}
          className="w-full h-full object-cover transition duration-500 ease-in-out group-hover:scale-105"
        />

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10 shadow-sm">
            {categoryName}
          </span>
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto p-2 -m-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img.image_url)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                activeImage === img.image_url
                  ? "border-orange-500 ring-2 ring-orange-500/30 scale-105 opacity-100 z-10"
                  : "border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100 hover:scale-105"
              }`}
            >
              <img
                src={img.image_url}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}