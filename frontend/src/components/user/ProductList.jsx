'use client';

import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

function SkeletonCard() {
  return (
    <article className="bg-white border border-[#EDEDF2] overflow-hidden animate-pulse">
      <div className="aspect-square bg-[#EDEDF2]" />
      <div className="p-[24px] space-y-[16px]">
        <div className="h-[28px] bg-[#EDEDF2] rounded w-[70%]" />
        <div className="h-[12px] bg-[#EDEDF2] rounded w-[40%]" />
        <div className="flex flex-wrap gap-[8px]">
          <div className="h-[20px] w-[32px] bg-[#EDEDF2] rounded" />
          <div className="h-[20px] w-[32px] bg-[#EDEDF2] rounded" />
          <div className="h-[20px] w-[32px] bg-[#EDEDF2] rounded" />
        </div>
        <div className="flex items-end justify-between pt-[8px]">
          <div className="h-[24px] bg-[#EDEDF2] rounded w-[24%]" />
          <div className="h-[16px] bg-[#EDEDF2] rounded w-[20%]" />
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-[80px] text-center">
      <div className="w-[64px] h-[64px] rounded-[16px] bg-[#EDEDF2] flex items-center justify-center mb-[16px]">
        <svg className="w-[24px] h-[24px] text-[#6E6E73]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-[#1D1D1F] font-[600] text-[17px] leading-[25px] mb-[4px]">Belum ada produk</h3>
      <p className="text-[#6E6E73] text-[17px] leading-[25px]">Produk akan segera tersedia.</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-[80px] text-center">
      <div className="w-[64px] h-[64px] rounded-[16px] bg-[#FFEBEE] flex items-center justify-center mb-[16px]">
        <svg className="w-[24px] h-[24px] text-[#C62828]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-[#1D1D1F] font-[600] text-[17px] leading-[25px] mb-[4px]">Gagal memuat produk</h3>
      <p className="text-[#6E6E73] text-[17px] leading-[25px]">{message || 'Silakan coba lagi nanti.'}</p>
    </div>
  );
}

/**
 * ProductList fetches and displays all products in a responsive grid.
 * Accepts filters to be forwarded to useProducts.
 * @param {Object} filters - { search?: string, category?: string }
 */
export default function ProductList({ filters = {}, sortBy = 'newest', onOpenDetails }) {
  const { data: products = [], isLoading, isError, error } = useProducts(filters);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'stock-desc') return b.stock - a.stock;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] lg:gap-[24px]"
      role="list"
      aria-label="Daftar produk"
    >
      {isLoading &&
        Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      {isError && <ErrorState message={error?.message} />}
      {!isLoading && !isError && sortedProducts.length === 0 && <EmptyState />}
      {!isLoading && !isError &&
        sortedProducts.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            onOpenDetails={onOpenDetails} 
          />
        ))}
    </div>
  );
}