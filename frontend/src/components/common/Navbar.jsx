'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('/');

  const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '#categories' },
    { label: 'Products', href: '#produk' },
    { label: 'About & Contact', href: '#footer' },
  ];

  // Detect active section on scroll
  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      // Check if user has scrolled to the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveSection('#footer');
        return;
      }

      const scrollPos = window.scrollY + 200;
      const footer = document.getElementById('footer');
      const produk = document.getElementById('produk');
      const categories = document.getElementById('categories');

      if (footer && scrollPos >= footer.offsetTop) {
        setActiveSection('#footer');
      } else if (produk && scrollPos >= produk.offsetTop) {
        setActiveSection('#produk');
      } else if (categories && scrollPos >= categories.offsetTop) {
        setActiveSection('#categories');
      } else {
        setActiveSection('/');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Smooth scroll handler when user clicks navbar links
  const handleNavClick = (e, href) => {
    if (pathname !== '/') return;

    if (href === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('/');
      return;
    }

    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(href);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#EBEBEF] transition-all duration-300">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(e, '/')}
            className="flex items-center gap-3 group"
            aria-label="Vivien's Store - Beranda"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo_vivien_store.png"
                alt="Logo Vivien's Store"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl tracking-tight text-[#1A1A1A] group-hover:text-[#C89B3C] transition-colors">
                Vivien&apos;s Store
              </span>
              <span className="text-[10px] font-sans tracking-[0.2em] text-[#777777] uppercase font-semibold">
                Luxurious Collection
              </span>
            </div>
          </Link>

          {/* Centered Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navigasi Utama">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-[14px] font-medium transition-colors relative py-1 cursor-pointer after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#C89B3C] after:transition-all after:duration-300 ${
                    isActive
                      ? 'text-[#C89B3C] font-semibold after:w-full'
                      : 'text-[#444444] hover:text-[#C89B3C] after:w-0 hover:after:w-full'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-full text-[#777777] hover:text-[#1A1A1A] hover:bg-[#F3F3F6] transition-colors"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>

            <a
              href="#produk"
              onClick={(e) => handleNavClick(e, '#produk')}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#C89B3C] hover:bg-[#B58A32] active:bg-[#9E7728] text-white text-[13px] font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02]"
            >
              SHOP NOW
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
