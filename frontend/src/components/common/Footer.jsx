import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import authApi from '@/api/authApi';

export default function Footer() {
  const year = new Date().getFullYear();
  const [contact, setContact] = useState({ email: 'admin@viviensstore.com', phone: '' });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await authApi.getContact();
        if (res.success && res.data) {
          setContact({
            email: res.data.email,
            phone: res.data.phone,
          });
        }
      } catch (err) {
        console.error('Gagal memuat kontak admin di footer:', err);
      }
    };
    fetchContact();
  }, []);

  return (
    <footer id="footer" className="bg-[#1A1A1A] text-white pt-16 pb-12 border-t border-[#333333]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <Image
                  src="/new_logo_vivien.png"
                  alt="Logo Vivien's Store"
                  fill
                  sizes="32px"
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

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-sans font-semibold text-xs text-[#C89B3C] uppercase tracking-widest mb-4">
              Kontak Kami
            </h4>
            <p className="text-sm text-gray-300 mb-1">
              Email: <a href={`mailto:${contact.email}`} className="text-[#C89B3C] hover:underline">{contact.email}</a>
            </p>
            <p className="text-sm text-gray-300 mb-2">
              Handphone: {contact.phone ? (
                <a href={`tel:${contact.phone}`} className="text-[#C89B3C] hover:underline">{contact.phone}</a>
              ) : (
                '-'
              )}
            </p>
            <div className="mt-3">
              <p className="text-sm text-gray-300">
                Buka Setiap Hari
              </p>
              <p className="text-xs text-gray-500 italic mt-1">
                (Silakan hubungi Admin terlebih dahulu sebelum berkunjung ke outlet Kami)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>&copy; {year} Vivien&apos;s Store. All rights reserved.</p>
          <div className="flex items-center gap-6">            
          </div>
        </div>
      </div>
    </footer>
  );
}