'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
const DEFAULT_WHATSAPP = '628123456789';

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProductDetailModal({ product, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const { name, category, price, stock, imageUrl, imageUrls, sizes = [], color, material, description, discount } = product;
  const isOutOfStock = stock === 0;

  const displayImageUrls = imageUrls && imageUrls.length > 0
    ? imageUrls
    : (imageUrl ? [imageUrl] : [PLACEHOLDER_IMAGE]);

  const colorList = color
    ? color.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  const hasDiscount = discount > 0;
  const discountPercent = discount || 0;
  const priceBeforeDiscount = price;
  const priceAfterDiscount = hasDiscount ? price * (1 - discountPercent / 100) : price;

  const waMessage = encodeURIComponent(
    `Halo Vivien's Store, saya berminat memesan produk berikut:\n\n` +
    `• *Nama Produk:* ${name}\n` +
    `• *Kategori:* ${category}\n` +
    (sizes.length > 0 ? `• *Ukuran:* ${sizes.join(', ')}\n` : '') +
    (color ? `• *Warna:* ${color}\n` : '') +
    `• *Harga:* ${formatRupiah(priceAfterDiscount)}\n\n` +
    `Apakah produk ini masih tersedia? Terima kasih.`
  );
  const waUrl = `https://wa.me/${DEFAULT_WHATSAPP}?text=${waMessage}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* 50/50 Split Floating Container with 28px Rounded Corners */}
      <div
        className="relative w-full max-w-4xl bg-white rounded-[28px] sm:rounded-[32px] shadow-2xl overflow-hidden transition-all duration-300 max-h-[90vh] flex flex-col md:flex-row animate-slide-up border border-[#EBEBEF]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Top Right Floating Circular Icon) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/10 hover:bg-[#1A1A1A] hover:text-white text-[#222222] flex items-center justify-center backdrop-blur-md transition-colors duration-200 shadow-sm"
          aria-label="Tutup modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Column: Full-Bleed Product Image */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-[#F3F3F6] overflow-hidden flex-shrink-0">
          <Image
            src={displayImageUrls[currentImageIndex]}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            unoptimized={!displayImageUrls[currentImageIndex].startsWith('http')}
          />

          {displayImageUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev === 0 ? displayImageUrls.length - 1 : prev - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors z-20 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev === displayImageUrls.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors z-20 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {displayImageUrls.length > 1 && (
            <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-md bg-black/60 text-white text-[10px] font-bold font-sans tracking-wide">
              {currentImageIndex + 1} / {displayImageUrls.length}
            </div>
          )}

          {/* Badge top-left inside image */}
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3.5 py-1.5 bg-[#C89B3C] text-white font-sans font-bold text-xs tracking-wider uppercase rounded-full shadow-lg">
              SALE
            </span>
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
              <span className="text-white text-sm font-sans font-bold tracking-widest uppercase bg-black/80 px-5 py-2.5 rounded-full border border-white/20">
                Stok Habis
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Controls */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Header: Category */}
            <div>
              <span className="text-xs font-sans font-bold uppercase tracking-[0.15em] text-[#C89B3C] block mb-1">
                {category}
              </span>
              <h2 id="modal-title" className="font-serif font-bold text-2xl sm:text-3xl text-[#1A1A1A] leading-tight">
                {name}
              </h2>
            </div>

            {/* Reviews / Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-[#C89B3C] text-sm">
                {'★'.repeat(5)}
              </div>
              <span className="text-sm font-sans font-semibold text-[#1A1A1A]">4.8</span>
              <span className="text-xs text-[#777777] font-sans">(32 ulasan pembeli)</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold font-sans text-[#1A1A1A]">
                {formatRupiah(priceAfterDiscount)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-[#999999] line-through font-sans">
                    {formatRupiah(priceBeforeDiscount)}
                  </span>
                  <span className="px-2.5 py-1 bg-[#C89B3C]/15 text-[#C89B3C] text-xs font-bold font-sans rounded-full">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            <div className="h-px bg-[#EBEBEF]" />

            {/* Description */}
            <p className="text-sm text-[#555555] leading-relaxed font-sans">
              {description || 'Produk pilihan kualitas terbaik dari Vivien\'s Store. Dirancang secara presisi dengan material premium untuk memberikan kenyamanan dan penampilan kasual yang elegan.'}
            </p>

            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {['Bahan Premium', 'Standard Fit', 'Model Timeless', 'Garansi Kualitas'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-[#F3F3F6] text-[#555555] rounded-full text-xs font-medium font-sans">
                  {tag}
                </span>
              ))}
            </div>

            {/* Color Selector */}
            {colorList.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#777777] block">
                  COLOR
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {colorList.map((c) => {
                    return (
                      <div
                        key={c}
                        className="px-4 h-11 rounded-2xl text-xs font-bold font-sans border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center shadow-sm select-none"
                      >
                        {c}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#777777] block">
                SIZE
              </span>
              <div className="flex flex-wrap gap-2.5">
                {(sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL']).map((sz) => {
                  return (
                    <div
                      key={sz}
                      className="w-11 h-11 rounded-2xl text-xs font-bold font-sans border border-[#1A1A1A] bg-[#1A1A1A] text-white flex items-center justify-center shadow-sm select-none"
                    >
                      {sz}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Button: Order via WhatsApp */}
          <div className="pt-4 border-t border-[#EBEBEF]">
            <a
              href={isOutOfStock ? '#' : waUrl}
              target={isOutOfStock ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={(e) => isOutOfStock && e.preventDefault()}
              className={`w-full py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#C89B3C] hover:bg-[#B58A32] active:bg-[#9E7728] text-white shadow-lg hover:shadow-xl hover:scale-[1.01]'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {isOutOfStock ? 'STOK HABIS' : 'PESAN SEKARANG VIA WHATSAPP'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
