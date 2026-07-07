import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ProductList from '@/components/user/ProductList';

export const metadata = {
  title: "Vivien's Store — Katalog Produk",
  description: "Temukan koleksi produk terbaik di Vivien's Store",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
            <div className="max-w-2xl space-y-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/15 border border-purple-500/20 text-purple-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Koleksi Terbaru Tersedia
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Temukan Produk{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Terbaik
                </span>{' '}
                untuk Anda
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed">
                Jelajahi koleksi produk pilihan kami dengan kualitas terjamin dan harga terbaik.
              </p>

              <a
                href="#produk"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-sm shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Lihat Produk
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Semua Produk</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Koleksi lengkap produk pilihan kami
              </p>
            </div>
          </div>

          {/* ProductList is a Client Component that uses React Query internally */}
          <ProductList />
        </section>
      </main>

      <Footer />
    </div>
  );
}
