'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import BentoGrid from '@/components/user/BentoGrid';
import CatalogSection from '@/components/user/CatalogSection';

export default function HomePage() {
  const [selectedBentoCategory, setSelectedBentoCategory] = useState<string | null>(null);

  const handleBentoCategorySelect = (categoryName: string) => {
    setSelectedBentoCategory(categoryName);
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9FB]">
      <Navbar />

      <main className="flex-1">
        {/* Section 2.1: Hero Section */}
        <section className="relative min-h-[620px] lg:min-h-[700px] flex items-center justify-start overflow-hidden bg-[#1A1A1A]">
          {/* Edge-to-Edge Lifestyle Modeling Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop"
              alt="Vivien's Store Luxury Collection"
              fill
              priority
              className="object-cover object-center opacity-85 scale-105 animate-fade-in"
            />
            {/* Gradient Dark Overlay for Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />
          </div>

          {/* Hero Text & CTA Content */}
          <div className="relative z-20 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="max-w-2xl space-y-6">
              {/* <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                <span className="w-2 h-2 rounded-full bg-[#C89B3C] animate-pulse" />
                New Season Collection 2026
              </span> */}

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]">
                <span className="text-white">Discover Your</span>{' '}
                <span className="text-[#C89B3C] italic font-serif font-normal">
                  Perfect
                </span>{' '}
                <span className="text-white">Style</span>
              </h1>


              <p className="text-gray-300 font-sans text-base sm:text-lg max-w-xl leading-relaxed">
                Koleksi terkurasi busana kasual dan elegan rancangan desainer terkini. Dibuat dengan material berkualitas tinggi untuk pesona tak tertandingi.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <a
                  href="#produk"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#C89B3C] hover:bg-[#B58A32] active:bg-[#9E7728] text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  SHOP NEW ARRIVALS
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>

                {/* <a
                  href="#categories"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-transparent hover:bg-white/10 text-white border-2 border-white/80 font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 backdrop-blur-sm"
                >
                  EXPLORE CATEGORIES
                </a> */}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2.3: Bento Grid System ("Find Your Look") */}
        <BentoGrid onSelectCategory={handleBentoCategorySelect} />

        {/* Section 3: Featured Pieces (Product Catalog Section) */}
        <section id="produk" className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[#C89B3C] block mb-2">
              Our Products
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A] font-bold">
              Featured Pieces
            </h2>
            <p className="text-sm font-sans text-[#777777] mt-2">
              Jelajahi setiap pilihan busana terbaik Vivien&apos;s Store
            </p>
            <div className="w-12 h-0.5 bg-[#C89B3C] mx-auto mt-4 rounded-full" />
          </div>

          <CatalogSection
            externalCategory={selectedBentoCategory}
            onClearExternalCategory={() => setSelectedBentoCategory(null)}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}