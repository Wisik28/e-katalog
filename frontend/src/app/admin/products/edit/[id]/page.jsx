'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';

const CATEGORIES = ['Dress', 'Blouse', 'Rok', 'Kemeja', 'Outer', 'Celana', 'Lainnya'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
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

  // Fetch existing product data
  const { data: product, isLoading: isLoadingProduct, isError: isProductError } = useProduct(id);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  // Pre-fill form once data arrives
  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name || '',
      category: product.category || '',
      price: String(product.price || ''),
      stock: String(product.stock ?? ''),
      discount: String(product.discount ?? ''),
      description: product.description || '',
      material: product.material || '',
      color: product.color || '',
    });
    if (product.imageUrls) {
      setImagePreviews(product.imageUrls);
    } else if (product.imageUrl) {
      setImagePreviews([product.imageUrl]);
    } else {
      setImagePreviews([]);
    }
    setImageFiles([]);
    setCurrentPreviewIndex(0);
    setSelectedSizes(product.sizes || []);
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageFiles(files);

    const readPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((results) => {
      setImagePreviews(results);
      setCurrentPreviewIndex(0);
    });
  };

  const handleResetImages = () => {
    setImageFiles([]);
    if (product?.imageUrls) {
      setImagePreviews(product.imageUrls);
    } else if (product?.imageUrl) {
      setImagePreviews([product.imageUrl]);
    } else {
      setImagePreviews([]);
    }
    setCurrentPreviewIndex(0);
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

    updateProduct(
      { id, formData },
      {
        onSuccess: () => router.push('/admin/products'),
        onError: (err) => {
          const msg = err?.response?.data?.message || 'Gagal memperbarui produk. Silakan coba lagi.';
          setError(msg);
        },
      }
    );
  };

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="space-y-6 max-w-4xl animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-white/10 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 rounded-2xl bg-slate-200 dark:bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  // Error fetching product
  if (isProductError) {
    return (
      <div className="max-w-4xl">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-8 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">Produk tidak ditemukan atau terjadi kesalahan.</p>
          <Link href="/admin/products" className="mt-4 inline-block text-sm text-purple-600 dark:text-purple-400 hover:underline">
            ← Kembali ke daftar produk
          </Link>
        </div>
      </div>
    );
  }



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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Produk</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            ID: <span className="font-mono text-purple-600 dark:text-purple-400">#{id}</span>
          </p>
        </div>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
        <svg className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.998L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.002C2.57 17.333 3.532 19 5.073 19z" />
        </svg>
        <p className="text-amber-600 dark:text-amber-400 text-sm">
          Perubahan yang Anda simpan akan langsung tampil di halaman katalog publik.
        </p>
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
          {/* Left column */}
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
                <label htmlFor="edit-product-image" className="block cursor-pointer group">
                  <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-purple-500/40 flex flex-col items-center justify-center overflow-hidden transition-all duration-200">
                    <div className="text-center p-6">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500/20 transition-colors">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-slate-700 dark:text-slate-400 text-sm font-medium">Klik untuk ganti foto</p>
                      <p className="text-slate-400 dark:text-slate-600 text-xs mt-1">JPG, PNG, WEBP maks 5MB (bisa pilih banyak)</p>
                    </div>
                  </div>
                </label>
              )}
              <input
                id="edit-product-image"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                multiple
              />
              <div className="flex gap-2 mt-3">
                {imageFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetImages}
                    className="flex-1 py-2 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl transition-all font-medium"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 text-xs text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl transition-all font-medium"
                >
                  Tambahkan
                </button>
              </div>
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

          {/* Right columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-sm">
              <h2 className="text-slate-900 dark:text-white font-semibold">Informasi Produk</h2>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Nama Produk <span className="text-red-500">*</span></label>
                <input id="edit-product-name" type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Kategori <span className="text-red-500">*</span></label>
                  <select id="edit-product-category" name="category" value={form.category} onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer">
                    <option value="" disabled>Pilih kategori</option>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Harga (Rp) <span className="text-red-500">*</span></label>
                  <input id="edit-product-price" type="number" name="price" value={form.price} onChange={handleChange} min={0} required className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300" />
                </div>
              </div>

              {/* Stock & Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Stok</label>
                  <input id="edit-product-stock" type="number" name="stock" value={form.stock} onChange={handleChange} min={0} className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300" />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Diskon (%)</label>
                  <input id="edit-product-discount" type="number" name="discount" value={form.discount} onChange={handleChange} placeholder="0" min={0} max={100} className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300" />
                </div>
              </div>

              {/* Color & Material */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Warna</label>
                  <input id="edit-product-color" type="text" name="color" value={form.color} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300" />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Bahan</label>
                  <input id="edit-product-material" type="text" name="material" value={form.material} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Deskripsi Produk</label>
                <textarea id="edit-product-description" name="description" value={form.description} onChange={handleChange} rows={5} className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-colors duration-300 resize-none" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link href="/admin/products" className="flex-1 py-3 text-center text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl transition-all shadow-sm">
                Batal
              </Link>
              <button
                id="edit-product-submit"
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
                    Simpan Perubahan
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
