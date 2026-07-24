import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-[#1A1A1A] text-white pt-16 pb-12 border-t border-[#333333]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <Image
                  src="/logo_vivien_store.png"
                  alt="Logo Vivien's Store"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-serif font-bold text-xl text-white">
                Vivien&apos;s Store
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Platform katalog busana & aksesoris pilihan berkualitas tinggi dengan rancangan timeless dan gaya kasual elegan.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-sans font-semibold text-xs text-[#C89B3C] uppercase tracking-widest mb-4">
              Koleksi & Menu
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-[#C89B3C] transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="#categories" className="hover:text-[#C89B3C] transition-colors">Kategori Populer</Link>
              </li>
              <li>
                <Link href="#produk" className="hover:text-[#C89B3C] transition-colors">Koleksi Terbaru</Link>
              </li>
              <li>
                <Link href="#produk" className="hover:text-[#C89B3C] transition-colors">Produk Pilihan</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-sans font-semibold text-xs text-[#C89B3C] uppercase tracking-widest mb-4">
              Layanan Pelanggan
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li><span className="hover:text-white cursor-pointer">Panduan Ukuran</span></li>
              <li><span className="hover:text-white cursor-pointer">Informasi Pengiriman</span></li>
              <li><span className="hover:text-white cursor-pointer">Pertanyaan Umum (FAQ)</span></li>
              <li><span className="hover:text-white cursor-pointer">Kebijakan Privasi</span></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-sans font-semibold text-xs text-[#C89B3C] uppercase tracking-widest mb-4">
              Kontak Kami
            </h4>
            <p className="text-sm text-gray-300 mb-2">
              Email: <a href="mailto:admin@viviensstore.com" className="text-[#C89B3C] hover:underline">admin@viviensstore.com</a>
            </p>
            <p className="text-sm text-gray-400">
              Senin - Sabtu (09:00 - 17:00 WIB)
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>&copy; {year} Vivien&apos;s Store. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}