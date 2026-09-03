'use client';

import { useState, useEffect } from 'react';
import ProductList from './ProductList';
import ProductDetailModal from './ProductDetailModal';

const CATEGORIES = ['Semua', 'Dress', 'Blouse', 'Rok', 'Kemeja', 'Outer', 'Celana', 'Lainnya'];

export default function CatalogSection({ externalCategory, onClearExternalCategory }) {
  const [searchVal, setSearchVal] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sync external category selected from Bento Grid
  useEffect(() => {
    if (externalCategory) {
      setSelectedCategory(externalCategory);
    }
  }, [externalCategory]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchVal]);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (externalCategory && cat !== externalCategory) {
      onClearExternalCategory?.();
    }
  };

  const filters = {
    ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
    ...(selectedCategory !== 'Semua' && { category: selectedCategory }),
  };

  return (
    <div className="space-y-8">
      {/* Controls: Search, Category, and Sort */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-[24px] border border-[#EBEBEF] shadow-sm">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Cari busana atau aksoris impian Anda..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full h-11 pl-12 pr-10 bg-[#F3F3F6] text-[#222222] placeholder-gray-400 rounded-full border-none outline-none focus:ring-2 focus:ring-[#C89B3C]/40 transition-all font-sans text-sm"
            />
            {searchVal && (
              <button
                onClick={() => setSearchVal('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Bersihkan pencarian"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort Selection */}
          <div className="relative w-fit flex-shrink-0 self-end md:self-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none h-11 pl-5 pr-11 bg-[#F3F3F6] text-[#222222] font-sans text-xs font-bold uppercase tracking-wider rounded-full border-none outline-none focus:ring-2 focus:ring-[#C89B3C]/40 transition-all cursor-pointer"
              aria-label="Urutkan produk"
            >
              <option value="newest">Terbaru</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
              <option value="stock-desc">Stok Terbanyak</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Category Pill Filters (Section 4.3 in DESIGN.md) */}
        <div className="relative">
          <div
            className="flex gap-2.5 overflow-x-auto no-scrollbar py-2 scroll-smooth"
            role="tablist"
            aria-label="Kategori Produk"
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex-shrink-0 h-10 px-5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white shadow-md scale-105 border border-[#1A1A1A]'
                      : 'bg-white text-[#555555] border border-[#EBEBEF] hover:border-[#C89B3C] hover:text-[#C89B3C]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Products */}
      <div className="pt-2">
        <ProductList
          filters={filters}
          sortBy={sortBy}
          onOpenDetails={(prod) => setSelectedProduct(prod)}
        />
      </div>

      {/* Detailed Product Modal Popup */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
