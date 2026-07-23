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

// Generate a deterministic badge and rating for demo aesthetic based on product ID/name
function getProductBadgeAndRating(product) {
  const charCodeSum = (product._id || product.name || 'a')
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const isSale = product.discount > 0;
  
  let badgeType = null;
  if (isSale) {
    badgeType = 'SALE';
  } else {
    const badges = ['BEST SELLER', 'NEW', null, null];
    badgeType = badges[charCodeSum % badges.length];
  }

  // Rating score between 4.6 and 5.0, count between 12 and 88
  const ratingScore = (4.6 + ((charCodeSum % 5) * 0.1)).toFixed(1);
  const reviewCount = 12 + (charCodeSum % 77);

  return { badgeType, ratingScore, reviewCount };
}

export default function ProductCard({ product, onOpenDetails }) {
  const { name, category, price, stock, imageUrl, color, material, discount } = product;
  const isOutOfStock = stock === 0;

  const { badgeType, ratingScore, reviewCount } = getProductBadgeAndRating(product);

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

        {/* Status Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {badgeType === 'BEST SELLER' && (
            <span className="px-3 py-1 bg-white text-[#1A1A1A] font-sans font-bold text-[10px] tracking-wider uppercase rounded-full shadow-md border border-black/5">
              BEST SELLER
            </span>
          )}
          {badgeType === 'NEW' && (
            <span className="px-3 py-1 bg-[#1A1A1A] text-white font-sans font-bold text-[10px] tracking-wider uppercase rounded-full shadow-md">
              NEW
            </span>
          )}
          {badgeType === 'SALE' && (
            <span className="px-3 py-1 bg-[#C89B3C] text-white font-sans font-bold text-[10px] tracking-wider uppercase rounded-full shadow-md">
              SALE
            </span>
          )}
        </div>

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
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Category */}
          <span className="text-[11px] font-sans font-semibold text-[#777777] uppercase tracking-wider block">
            {category}
          </span>

          {/* Product Title */}
          <h3 className="font-sans font-bold text-[#222222] text-base leading-snug line-clamp-2 group-hover:text-[#C89B3C] transition-colors">
            {name}
          </h3>

          {/* Additional details */}
          {(color || material) && (
            <p className="text-xs text-[#777777] font-sans truncate">
              {[color, material].filter(Boolean).join(' · ')}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex items-center text-[#C89B3C] text-xs">
              {'★'.repeat(5)}
            </div>
            <span className="text-xs font-sans font-medium text-[#777777]">
              {ratingScore} ({reviewCount})
            </span>
          </div>
        </div>

        {/* Price & View Details Link */}
        <div className="pt-3 border-t border-[#EBEBEF] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-sans font-bold text-[#1A1A1A] text-lg">
              {formatRupiah(priceAfterDiscount)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#999999] line-through font-sans">
                {formatRupiah(priceBeforeDiscount)}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-sans font-bold text-[#C89B3C] group-hover:translate-x-1 transition-transform duration-300">
            View Details
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}