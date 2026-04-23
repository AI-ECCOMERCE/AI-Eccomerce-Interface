"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { brandIconMap } from "../../components/BrandIcons";
import { API_URL, CART_STORAGE_KEY, CartItem } from "../../lib/checkout";
import { getProductCatalog, generalTerms } from "../../lib/product-catalog";

interface Variant {
  id: string;
  name: string;
  price: number;
  original_price: number;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  category_slug: string;
  description: string;
  price: number;
  original_price: number;
  rating: number;
  reviews_count: number;
  badge_text?: string;
  badge_color?: string;
  icon: string;
  gradient: string;
  shadow: string;
  stock: number;
  status: string;
  variants?: Variant[];
}

interface ProductDetailClientProps {
  productId: string;
}

export default function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        if (data.success) {
          const found = data.data.find((p: Product) => p.id === productId);
          if (found) {
            setProduct(found);
            if (found.variants && found.variants.length > 0) {
              const inStock = found.variants.find((v: Variant) => v.stock > 0);
              setSelectedVariant(inStock || found.variants[0]);
            }
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    const cart: CartItem[] = saved ? JSON.parse(saved) : [];

    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

    setToastMessage(`${item.name} ditambahkan ke keranjang!`);
    setToastVisible(true);
    window.setTimeout(() => setToastVisible(false), 2500);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const hasVariants = product.variants && product.variants.length > 0;

    if (hasVariants && selectedVariant) {
      addToCart({
        id: selectedVariant.id,
        name: `${product.name} - ${selectedVariant.name}`,
        price: selectedVariant.price,
      });
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const formatDiscount = (price: number, original: number) => {
    if (!original || original <= price) return null;
    return `-${Math.round((1 - price / original) * 100)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <i className="ph-duotone ph-warning text-4xl text-slate-400"></i>
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 mb-2">Produk Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 mb-6">Produk yang kamu cari tidak tersedia atau sudah dihapus.</p>
          <Link
            href="/#products"
            className="btn-primary px-6 py-3 text-sm font-semibold text-white rounded-xl inline-flex items-center gap-2"
          >
            <i className="ph-duotone ph-arrow-left text-base"></i>
            Kembali ke Produk
          </Link>
        </div>
      </div>
    );
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const totalStock = hasVariants
    ? product.variants!.reduce((acc, v) => acc + v.stock, 0)
    : product.stock;

  const displayPrice = hasVariants && selectedVariant
    ? selectedVariant.price
    : product.price;
  const displayOriginalPrice = hasVariants && selectedVariant
    ? selectedVariant.original_price
    : product.original_price;
  const discount = formatDiscount(displayPrice, displayOriginalPrice);

  const IconComponent = brandIconMap[product.icon] || brandIconMap[product.name];
  const catalogInfo = getProductCatalog(product.icon, product.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo1.png"
                alt="Poinstore Logo"
                width={140}
                height={38}
                className="h-7 sm:h-8 lg:h-9 w-auto object-contain"
              />
            </Link>

            <Link
              href="/#products"
              className="text-sm text-slate-500 hover:text-brand-600 transition-colors flex items-center gap-1"
            >
              <i className="ph-duotone ph-arrow-left text-base"></i>
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-400">
            <li>
              <Link href="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
            </li>
            <li><i className="ph ph-caret-right text-xs"></i></li>
            <li>
              <Link href="/#products" className="hover:text-brand-600 transition-colors">Produk</Link>
            </li>
            <li><i className="ph ph-caret-right text-xs"></i></li>
            <li className="text-slate-700 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Product Info */}
          <div className="lg:col-span-3">
            {/* Product Header */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                {/* Icon + Name */}
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm p-4 flex-shrink-0">
                    {IconComponent ? (
                      <IconComponent className="w-full h-full object-contain" />
                    ) : (
                      <i className={`ph-duotone ${product.icon} text-4xl text-slate-400`}></i>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {product.badge_text && (
                        <span className="px-2.5 py-1 rounded-lg bg-brand-50 text-brand-600 text-xs font-bold">
                          {product.badge_text}
                        </span>
                      )}
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${totalStock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {totalStock > 0 ? `Stok Tersedia` : "Stok Habis"}
                      </span>
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                      {product.name}
                    </h1>
                    <p className="mt-2 text-slate-500 text-sm sm:text-base leading-relaxed">
                      {product.description}
                    </p>

                    {/* System Type Badge */}
                    <div className="mt-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${catalogInfo.systemColor}`}>
                        <i className={`ph-duotone ${catalogInfo.systemIcon} text-sm`}></i>
                        {catalogInfo.systemType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-50 to-purple-50 border border-brand-100/50">
                  <div className="flex items-end justify-between flex-wrap gap-3">
                    <div>
                      {hasVariants && selectedVariant && (
                        <span className="text-xs font-semibold text-slate-500 block mb-1">
                          Harga untuk {selectedVariant.name}
                        </span>
                      )}
                      {displayOriginalPrice > displayPrice && (
                        <span className="text-sm text-slate-400 line-through mr-2">
                          Rp {formatPrice(displayOriginalPrice)}
                        </span>
                      )}
                      <div className="flex items-end gap-2">
                        <span className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
                          Rp {formatPrice(displayPrice)}
                        </span>
                      </div>
                    </div>
                    {discount && (
                      <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-500 text-sm font-bold">
                        {discount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Variants Section */}
              {hasVariants && product.variants && (
                <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                  <h3 className="font-display font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
                    <i className="ph-duotone ph-list-checks text-lg text-brand-500"></i>
                    Pilih Varian
                  </h3>
                  <div className="space-y-3">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      const isOutOfStock = variant.stock <= 0;
                      const variantDiscount = formatDiscount(variant.price, variant.original_price);

                      return (
                        <div
                          key={variant.id}
                          onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                          className={`
                            flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer
                            ${isOutOfStock ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-100' :
                              isSelected ? 'border-brand-500 bg-brand-50/50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-brand-500' : 'border-slate-300'}`}>
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-brand-500"></div>}
                            </div>
                            <div>
                              <p className={`font-bold ${isSelected ? 'text-brand-700' : 'text-slate-900'}`}>{variant.name}</p>
                              <p className="text-xs font-medium text-slate-500 mt-0.5">
                                {isOutOfStock ? 'Stok Habis' : `Sisa stok: ${variant.stock}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {variant.original_price > variant.price && (
                              <p className="text-xs text-slate-400 line-through mb-0.5">
                                Rp {formatPrice(variant.original_price)}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <p className={`font-extrabold font-display ${isSelected ? 'text-brand-700' : 'text-slate-900'}`}>
                                Rp {formatPrice(variant.price)}
                              </p>
                              {variantDiscount && (
                                <span className="px-1.5 py-0.5 rounded-md bg-red-50 text-red-500 text-[10px] font-bold">
                                  {variantDiscount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Detail Produk Card */}
            <div className="mt-6 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
                  <i className="ph-duotone ph-info text-xl text-brand-500"></i>
                  Detail Produk
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  {catalogInfo.detailDescription}
                </p>
                <div className="space-y-3">
                  {catalogInfo.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className={`ph-duotone ${h.icon} text-base text-brand-600`}></i>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed pt-1">{h.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Syarat & Ketentuan Card */}
            <div className="mt-6 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 sm:p-8">
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
                  <i className="ph-duotone ph-scroll text-xl text-amber-500"></i>
                  Syarat & Ketentuan
                </h3>

                {/* Product-specific rules */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Aturan Khusus {product.name}</p>
                  <div className="space-y-2.5">
                    {catalogInfo.rules.map((rule, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <i className="ph-duotone ph-warning-circle text-base text-amber-500 mt-0.5 flex-shrink-0"></i>
                        <p className="text-sm text-slate-600 leading-relaxed">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* General terms */}
                <div className="pt-5 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Ketentuan Umum</p>
                  <div className="space-y-2.5">
                    {generalTerms.map((term, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <i className="ph-duotone ph-check-circle text-base text-slate-400 mt-0.5 flex-shrink-0"></i>
                        <p className="text-sm text-slate-500 leading-relaxed">{term}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <i className="ph-duotone ph-shield-check text-xl text-green-600"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Garansi 7 Hari</p>
                  <p className="text-xs text-slate-500 mt-0.5">Bermasalah? Langsung diganti baru</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <i className="ph-duotone ph-lightning text-xl text-blue-600"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Pengiriman Instan</p>
                  <p className="text-xs text-slate-500 mt-0.5">Akun dikirim otomatis via email</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <i className="ph-duotone ph-headset text-xl text-brand-600"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Support 24/7</p>
                  <p className="text-xs text-slate-500 mt-0.5">Tim support siap membantu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-purple-50">
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <i className="ph-duotone ph-shopping-cart-simple text-xl text-brand-600"></i>
                  Pesan Sekarang
                </h3>
              </div>

              <div className="p-6">
                {/* Selected Product Summary */}
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-2 shadow-sm flex-shrink-0">
                    {IconComponent ? (
                      <IconComponent className="w-full h-full object-contain" />
                    ) : (
                      <i className={`ph-duotone ${product.icon} text-2xl text-slate-400`}></i>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">{product.name}</p>
                    {hasVariants && selectedVariant && (
                      <p className="text-xs text-brand-600 font-medium mt-0.5">{selectedVariant.name}</p>
                    )}
                  </div>
                </div>

                {/* Price Details */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Harga</span>
                    <span className="text-sm font-semibold text-slate-700">
                      Rp {formatPrice(displayPrice)}
                    </span>
                  </div>
                  {displayOriginalPrice > displayPrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">Hemat</span>
                      <span className="text-sm font-semibold text-emerald-600">
                        - Rp {formatPrice(displayOriginalPrice - displayPrice)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-slate-100 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <span className="text-xl font-display font-extrabold text-brand-600">
                      Rp {formatPrice(displayPrice)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={totalStock <= 0 || (hasVariants && !!selectedVariant && selectedVariant.stock <= 0)}
                  className="w-full btn-primary py-3.5 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25"
                >
                  {totalStock <= 0 ? (
                    <><i className="ph-duotone ph-x-circle text-lg"></i> Stok Habis</>
                  ) : (
                    <><i className="ph-duotone ph-shopping-cart-simple text-lg"></i> Tambah ke Keranjang</>
                  )}
                </button>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/6285656252426"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full py-3 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-100"
                >
                  <i className="ph-duotone ph-whatsapp-logo text-lg text-green-600"></i>
                  Tanya via WhatsApp
                </a>
              </div>

              {/* Trust Badge */}
              <div className="px-6 pb-6">
                <div className="p-4 rounded-2xl bg-green-50/80 border border-green-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <i className="ph-duotone ph-shield-check text-lg text-green-600"></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800">Garansi 7 Hari</p>
                      <p className="text-xs text-green-600 mt-0.5 leading-relaxed">
                        Akun bermasalah? Langsung diganti baru tanpa biaya tambahan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <div className="flex items-center gap-3 px-5 py-3.5 bg-slate-900 text-white rounded-2xl shadow-2xl">
            <i className="ph-duotone ph-check-circle text-xl text-emerald-400"></i>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
