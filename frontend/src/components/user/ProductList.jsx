'use client';

import { useProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-200 dark:bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
        <div className="flex gap-1">
          <div className="h-5 w-8 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-5 w-8 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 className="text-slate-700 dark:text-slate-300 font-semibold text-base mb-1">Belum ada produk</h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm">Produk akan segera tersedia.</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-slate-700 dark:text-slate-300 font-semibold text-base mb-1">Gagal memuat produk</h3>
      <p className="text-slate-400 dark:text-slate-500 text-sm">{message || 'Silakan coba lagi nanti.'}</p>
    </div>
  );
}

/**
 * ProductList fetches and displays all products in a responsive grid.
 * Accepts filters to be forwarded to useProducts.
 * @param {Object} filters - { search?: string, category?: string }
 */
export default function ProductList({ filters = {} }) {
  const { data: products, isLoading, isError, error } = useProducts(filters);

  return (
    <div id="produk" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {isLoading &&
        Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

      {isError && <ErrorState message={error?.message} />}

      {!isLoading && !isError && products?.length === 0 && <EmptyState />}

      {!isLoading && !isError &&
        products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
    </div>
  );
}
