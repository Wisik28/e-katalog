'use client';

import Image from 'next/image';

const BENTO_ITEMS = [
  {
    id: 'women',
    categoryName: 'Dress',
    title: "Women's Fashion",
    subtitle: 'Koleksi gaun & blouse premium',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    sizeClass: 'col-span-1 md:col-span-2 row-span-2 min-h-[280px] sm:min-h-[360px] md:min-h-[440px]',
  },
  {
    id: 'men',
    categoryName: 'Kemeja',
    title: "Men's Fashion",
    subtitle: 'Kemeja & celana kasual modern',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop',
    sizeClass: 'col-span-1 row-span-1 min-h-[130px] sm:min-h-[180px] md:min-h-[220px]',
  },
  {
    id: 'pants',
    categoryName: 'Celana',
    title: 'Casual Pants',
    subtitle: 'Koleksi celana nyaman & stylish',
    image: '/pants_category.png',
    sizeClass: 'col-span-1 row-span-1 min-h-[130px] sm:min-h-[180px] md:min-h-[220px]',
  },
  {
    id: 'new-arrivals',
    categoryName: 'Lainnya',
    title: 'New Arrivals',
    subtitle: 'Rancangan terbaru musim ini',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
    sizeClass: 'col-span-2 row-span-1 min-h-[130px] sm:min-h-[180px] md:min-h-[220px]',
  },
];

export default function BentoGrid({ onSelectCategory }) {
  const handleClick = (categoryName) => {
    onSelectCategory?.(categoryName);
    const elem = document.getElementById('produk');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="categories" className="py-12 bg-[#F9F9FB]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#C89B3C] block mb-2">
            Styles
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-bold">
            Kategori
          </h2>
          <div className="w-12 h-0.5 bg-[#C89B3C] mx-auto mt-4 rounded-full" />
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {BENTO_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item.categoryName)}
              className={`group relative overflow-hidden rounded-[24px] sm:rounded-[32px] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5 ${item.sizeClass}`}
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority={item.id === 'women'}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

              {/* Gold Circular Arrow Navigation Button inside card */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#C89B3C] text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white group-hover:text-[#1A1A1A] transition-all duration-300">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>

              {/* Text & Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 text-white space-y-1">
                <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] sm:text-[11px] font-sans font-semibold uppercase tracking-wider text-white mb-1.5 sm:mb-2">
                  {item.categoryName}
                </span>
                <h3 className="font-serif text-sm sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#F3E5C8] transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] sm:text-sm text-gray-200 font-sans leading-relaxed line-clamp-1 sm:line-clamp-none">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
