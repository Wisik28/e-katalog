import Image from 'next/image';

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x400/1e293b/94a3b8?text=No+Image';

/**
 * Format number as Indonesian Rupiah.
 */
function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * ProductCard displays a single product's information.
 * @param {{ product: import('../../../lib/api').Product }} props
 */
export default function ProductCard({ product }) {
  const { name, category, price, stock, imageUrl, sizes, color, material } = product;
  const isOutOfStock = stock === 0;

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageUrl || PLACEHOLDER_IMAGE}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized={!imageUrl}
        />
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-semibold tracking-wider uppercase bg-black/60 px-3 py-1.5 rounded-full">
              Stok Habis
            </span>
          </div>
        )}
        {/* Category badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 backdrop-blur-sm border border-white/20">
          {category}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {name}
          </h2>
          {(color || material) && (
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 truncate">
              {[color, material].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        {/* Sizes */}
        {sizes?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {sizes.slice(0, 5).map((size) => (
              <span
                key={size}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5"
              >
                {size}
              </span>
            ))}
            {sizes.length > 5 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] text-slate-400">+{sizes.length - 5}</span>
            )}
          </div>
        )}

        {/* Price & stock */}
        <div className="flex items-end justify-between pt-1">
          <span className="text-purple-600 dark:text-purple-400 font-bold text-base">
            {formatRupiah(price)}
          </span>
          <span className={`text-xs font-medium ${isOutOfStock ? 'text-red-400' : 'text-emerald-500'}`}>
            {isOutOfStock ? 'Habis' : `Stok: ${stock}`}
          </span>
        </div>
      </div>
    </article>
  );
}
