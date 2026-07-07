'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

export default function AdminDashboardPage() {
  const { data: products = [], isLoading } = useProducts();

  // Derived stats
  const totalProducts = products.length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const categories = [...new Set(products.map((p) => p.category))];
  const recentProducts = [...products].slice(0, 5);

  // Category breakdown
  const categoryBreakdown = categories.map((cat) => ({
    name: cat,
    count: products.filter((p) => p.category === cat).length,
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  const colorMap = ['bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-emerald-500', 'bg-slate-500'];

  const stats = [
    {
      label: 'Total Produk',
      value: isLoading ? '—' : totalProducts,
      change: isLoading ? '' : `${outOfStock} stok habis`,
      positive: outOfStock === 0,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
      color: 'from-purple-500 to-violet-600',
      bg: 'from-purple-500/10 to-violet-600/5',
      border: 'border-purple-500/20',
    },
    {
      label: 'Kategori',
      value: isLoading ? '—' : categories.length,
      change: 'Aktif',
      positive: true,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
      color: 'from-pink-500 to-rose-600',
      bg: 'from-pink-500/10 to-rose-600/5',
      border: 'border-pink-500/20',
    },
    {
      label: 'Total Stok Tersedia',
      value: isLoading ? '—' : totalProducts - outOfStock,
      change: `${outOfStock} habis`,
      positive: outOfStock === 0,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      color: 'from-emerald-500 to-teal-600',
      bg: 'from-emerald-500/10 to-teal-600/5',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Stok Habis',
      value: isLoading ? '—' : outOfStock,
      change: outOfStock > 0 ? 'Perlu restock' : 'Semua tersedia',
      positive: outOfStock === 0,
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.998L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.002C2.57 17.333 3.532 19 5.073 19z" /></svg>,
      color: 'from-amber-500 to-orange-600',
      bg: 'from-amber-500/10 to-orange-600/5',
      border: 'border-amber-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors duration-300">Selamat datang kembali, Admin</p>
        </div>
        <Link
          href="/admin/products/create"
          id="dashboard-add-product-btn"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Produk
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`relative overflow-hidden bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold text-slate-900 dark:text-white mt-1 ${isLoading ? 'animate-pulse' : ''}`}>{stat.value}</p>
                <p className={`text-xs mt-2 ${stat.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{stat.change}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent products table */}
        <div className="xl:col-span-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5">
            <h2 className="text-slate-900 dark:text-white font-semibold">Produk Terbaru</h2>
            <Link href="/admin/products" className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium transition-colors">
              Lihat semua 
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-100 dark:border-white/5">
                  <th className="px-5 py-3 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Produk</th>
                  <th className="px-5 py-3 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Harga</th>
                  <th className="px-5 py-3 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Stok</th>
                  <th className="px-5 py-3 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {[1, 2, 3, 4].map((j) => (
                          <td key={j} className="px-5 py-3.5">
                            <div className="h-4 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : recentProducts.map((product) => {
                      const isOutOfStock = product.stock === 0;
                      return (
                        <tr key={product._id} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors group">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 flex-shrink-0 overflow-hidden relative">
                                {product.imageUrl
                                  ? <Image src={product.imageUrl} alt={product.name} fill className="object-cover" unoptimized />
                                  : <span className="w-full h-full flex items-center justify-center text-slate-400 text-xs">—</span>
                                }
                              </div>
                              <div>
                                <p className="text-slate-900 dark:text-white text-sm font-medium line-clamp-1">{product.name}</p>
                                <p className="text-slate-400 dark:text-slate-500 text-xs">{product.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 text-sm font-medium">{formatRupiah(product.price)}</td>
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 text-sm">{product.stock} pcs</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              isOutOfStock
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {isOutOfStock ? 'Habis' : 'Tersedia'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: quick actions + category breakdown */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
            <h2 className="text-slate-900 dark:text-white font-semibold mb-4">Aksi Cepat</h2>
            <div className="space-y-2">
              {[
                { href: '/admin/products/create', label: 'Tambah Produk Baru', color: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /> },
                { href: '/admin/products', label: 'Kelola Semua Produk', color: 'bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /> },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-150 group">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
              <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-150 group">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </div>
                <span className="text-sm font-medium">Lihat Halaman Katalog</span>
              </a>
            </div>
          </div>

          {/* Category breakdown — from real data */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
            <h2 className="text-slate-900 dark:text-white font-semibold mb-4">Kategori Produk</h2>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-5 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : categoryBreakdown.length === 0 ? (
              <p className="text-slate-400 dark:text-slate-600 text-sm">Belum ada produk.</p>
            ) : (
              <div className="space-y-3">
                {categoryBreakdown.map((cat, i) => {
                  const pct = totalProducts > 0 ? Math.round((cat.count / totalProducts) * 100) : 0;
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-300">{cat.name}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-xs">{cat.count} produk</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full ${colorMap[i] ?? 'bg-slate-400'} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
