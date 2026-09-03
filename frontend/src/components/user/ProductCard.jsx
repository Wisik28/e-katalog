'use client';

import Image from 'next/image';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop';

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProductCard({ product, onOpenDetails }) {
  const { name, category, price, stock, imageUrl, color, material, discount } = product;
  const isOutOfStock = stock === 0;

  const hasDiscount = discount > 0;
  const discountPercent = discount || 0;
  const priceBeforeDiscount = price;
  const priceAfterDiscount = hasDiscount ? price * (1 - discountPercent / 100) : price;

  return (
    <article
      onClick={() => onOpenDetails?.(product)}
      className="group relative bg-white rounded-[24px] border border-[#EBEBEF] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-[#C89B3C]/30 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3F3F6]">
        <Image
          src={imageUrl || PLACEHOLDER_IMAGE}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          unoptimized={!imageUrl}
        />


        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="text-white text-xs font-sans font-bold tracking-widest uppercase bg-black/80 border border-white/20 px-4 py-2 rounded-full shadow-xl">
              Stok Habis
            </span>
          </div>
        )}

        {/* Hover Slide-up QUICK VIEW Button */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex justify-center z-20">
          <button
            type="button"
            className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#C89B3C] text-white text-xs font-sans font-semibold tracking-wider uppercase rounded-xl transition-colors duration-300 shadow-lg"
          >
            QUICK VIEW
          </button>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-1.5">
          {/* Category */}
          <span className="text-[10px] sm:text-[11px] font-sans font-semibold text-[#777777] uppercase tracking-wider block">
            {category}
          </span>

          {/* Product Title */}
          <h3 className="font-sans font-bold text-[#222222] text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#C89B3C] transition-colors">
            {name}
          </h3>

          {/* Additional details */}
          {(color || material) && (
            <p className="text-[11px] sm:text-xs text-[#777777] font-sans truncate">
              {[color, material].filter(Boolean).join(' · ')}
            </p>
          )}


        </div>

        {/* Price & View Details Link */}
        <div className="pt-2.5 sm:pt-3 border-t border-[#EBEBEF] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans font-bold text-[#1A1A1A] text-base sm:text-lg">
              {formatRupiah(priceAfterDiscount)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-[#999999] line-through font-sans">
                {formatRupiah(priceBeforeDiscount)}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-sans font-bold text-[#C89B3C] group-hover:translate-x-1 transition-transform duration-300">
            <span className="hidden sm:inline">View Details</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}