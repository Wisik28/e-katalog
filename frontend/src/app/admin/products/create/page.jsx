'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateProduct } from '@/hooks/useProducts';

const CATEGORIES = ['Dress', 'Blouse', 'Rok', 'Kemeja', 'Outer', 'Celana', 'Tunik'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function CreateProductPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    discount: '',
    description: '',
    material: '',
    color: '',
  });

  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);

    const readPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((results) => {
      setImagePreviews((prev) => {
        const nextPreviews = [...prev, ...results];
        setCurrentPreviewIndex(prev.length);
        return nextPreviews;
      });
    });
  };

  const handleRemoveCurrentImage = () => {
    setImagePreviews((prev) => {
      const nextPreviews = prev.filter((_, idx) => idx !== currentPreviewIndex);
      setCurrentPreviewIndex(Math.max(0, currentPreviewIndex - 1));
      return nextPreviews;
    });
    setImageFiles((prev) => prev.filter((_, idx) => idx !== currentPreviewIndex));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.category || !form.price) {
      setError('Nama produk, kategori, dan harga wajib diisi.');
      return;
    }

    // Build FormData — required by backend for multipart/form-data
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('category', form.category);
    formData.append('price', form.price);
    formData.append('stock', form.stock || '0');
    formData.append('discount', form.discount || '0');
    formData.append('description', form.description);
    formData.append('material', form.material);
    formData.append('color', form.color);
    formData.append('sizes', JSON.stringify(selectedSizes));
    imageFiles.forEach((file) => {
      formData.append('image', file);
    });

    createProduct(formData, {
      onSuccess: () => router.push('/admin/products'),
      onError: (err) => {
        const msg = err?.response?.data?.message || 'Gagal menyimpan produk. Silakan coba lagi.';
        setError(msg);
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tambah Produk</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Isi detail produk baru Vivien&apos;s Store</p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-xl text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: image + sizes */}
          <div className="space-y-4">
            {/* Image upload */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
              <h2 className="text-slate-900 dark:text-white font-semibold mb-4">Foto Produk</h2>
              {imagePreviews.length > 0 ? (
                <div className="aspect-square rounded-xl border-2 border-dashed border-purple-500/40 flex flex-col items-center justify-center overflow-hidden transition-all duration-200">
                  <div className="relative w-full h-full group/preview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreviews[currentPreviewIndex]} alt="Preview" className="w-full h-full object-cover" />
                    
                    {imagePreviews.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentPreviewIndex((prev) => (prev === 0 ? imagePreviews.length - 1 : prev - 1));
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentPreviewIndex((prev) => (prev === imagePreviews.length - 1 ? 0 : prev + 1));
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/60 text-white text-[10px] font-bold font-sans tracking-wide">
                      {currentPreviewIndex + 1} / {imagePreviews.length}
                    </div>
                  </div>
                </div>
              ) : (
                <label htmlFor="product-image" className="block cursor-pointer group">
                  <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-purple-500/40 flex flex-col items-center justify-center overflow-hidden transition-all duration-200">
                    <div className="text-center p-6">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500/20 transition-colors">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-slate-700 dark:text-slate-400 text-sm font-medium">Klik untuk upload foto</p>
                      <p className="text-slate-400 dark:text-slate-600 text-xs mt-1">JPG, JPEG, PNG, WEBP maks 5MB (bisa pilih banyak)</p>
                    </div>
                  </div>
                </label>
              )}
              <input
                id="product-image"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                multiple
              />
              {imagePreviews.length > 0 && (
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={handleRemoveCurrentImage}
                    className="flex-1 py-2 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl transition-all font-medium"
                  >
                    Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 text-xs text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl transition-all font-medium"
                  >
                    Tambahkan
                  </button>
                </div>
              )}
            </div>

            {/* Sizes */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm">
              <h2 className="text-slate-900 dark:text-white font-semibold mb-4">Ukuran Tersedia</h2>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                      selectedSizes.includes(size)
                        ? 'bg-purple-50 dark:bg-purple-500/20 border-purple-200 dark:border-purple-500/40 text-purple-600 dark:text-purple-300'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSizes.length > 0 && (
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-3">Dipilih: {selectedSizes.join(', ')}</p>
              )}
            </div>
          </div>

          {/* Right columns: product details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-sm">
              <h2 className="text-slate-900 dark:text-white font-semibold">Informasi Produk</h2>

              {/* Name */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Nama Produk <span className="text-red-500">*</span></label>
                <input id="product-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="contoh: Dress Bunga Lavender" required className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 transition-colors duration-300" />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Kategori <span className="text-red-500">*</span></label>
                  <select id="product-category" name="category" value={form.category} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer">
                    <option value="" disabled>Pilih kategori</option>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Harga (Rp) <span className="text-red-500">*</span></label>
                  <input id="product-price" type="number" name="price" value={form.price} onChange={handleChange} placeholder="150000" min={0} required className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300" />
                </div>
              </div>

              {/* Stock & Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Stok</label>
                  <input id="product-stock" type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" min={0} className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300" />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Diskon (%)</label>
                  <input id="product-discount" type="number" name="discount" value={form.discount} onChange={handleChange} placeholder="0" min={0} max={100} className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300" />
                </div>
              </div>

              {/* Color & Material */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Warna</label>
                  <input id="product-color" type="text" name="color" value={form.color} onChange={handleChange} placeholder="contoh: Lavender, Putih" className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300" />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Bahan</label>
                  <input id="product-material" type="text" name="material" value={form.material} onChange={handleChange} placeholder="contoh: Katun, Linen, Polyester" className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Deskripsi Produk</label>
                <textarea id="product-description" name="description" value={form.description} onChange={handleChange} placeholder="Tulis deskripsi detail tentang produk ini..." rows={5} className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300 resize-none" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link href="/admin/products" className="flex-1 py-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl transition-all shadow-sm">
                Batal
              </Link>
              <button
                id="create-product-submit"
                type="submit"
                disabled={isPending}
                className="flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-60 rounded-xl transition-all shadow-lg shadow-purple-500/20 hover:-translate-y-0.5"
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Simpan Produk
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
