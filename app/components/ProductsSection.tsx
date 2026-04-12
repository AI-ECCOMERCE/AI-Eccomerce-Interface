"use client";

import { useState, useEffect, useRef } from "react";
import { brandIconMap } from "./BrandIcons";
import { API_URL, CartItem } from "../lib/checkout";
import ProductVariantModal from "./ProductVariantModal";

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

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductsSectionProps {
  onAddToCart: (product: Omit<CartItem, "quantity">) => void;
}

export default function ProductsSection({ onAddToCart }: ProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([
    { id: "all", label: "Semua Produk" },
  ]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch products & categories from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/api/products`),
          fetch(`${API_URL}/api/categories`),
        ]);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        if (productsData.success) {
          setProducts(productsData.data);
        }

        if (categoriesData.success) {
          const cats = [
            { id: "all", label: "Semua Produk" },
            ...categoriesData.data.map((c: Category) => ({
              id: c.slug,
              label: c.name,
            })),
          ];
          setCategories(cats);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category_slug === activeCategory);

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `Rp ${Math.round(price / 1000)}K`;
    }
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const formatDiscount = (price: number, original: number) => {
    if (!original || original <= price) return null;
    return `-${Math.round((1 - price / original) * 100)}%`;
  };



  return (
    <section id="products" className="py-20 lg:py-28 bg-white relative" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 reveal">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Pilih Tools AI <span className="gradient-text">Terbaik</span> Untukmu
          </h2>
          <p className="mt-4 text-slate-500 text-base lg:text-lg">
            Semua akun premium original dengan garansi penuh. Pilih sesuai kebutuhanmu.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 reveal">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`category-tab px-5 py-2.5 rounded-full text-sm font-semibold border border-slate-200 bg-white text-slate-600 ${
                activeCategory === cat.id ? "active" : ""
              }`}
              data-category={cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-400">Memuat produk...</p>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div id="products-grid" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const hasVariants = product.variants && product.variants.length > 0;
              const displayPrice = hasVariants 
                ? Math.min(...product.variants!.map(v => v.price)) 
                : product.price;
              const displayOriginalPrice = hasVariants
                ? Math.max(...product.variants!.map(v => v.original_price))
                : product.original_price;
              const totalStock = hasVariants
                ? product.variants!.reduce((acc, v) => acc + v.stock, 0)
                : product.stock;

              const discount = formatDiscount(displayPrice, displayOriginalPrice);

              return (
                <div
                  key={product.id}
                  className="product-card bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm"
                  data-category={product.category_slug}
                  style={{ animation: "scaleIn 0.4s ease-out forwards" }}
                >
                  <div className="relative p-6 pb-0">
                    <div className="product-icon w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm p-3">
                      {brandIconMap[product.icon] || brandIconMap[product.name] ? (
                        (() => {
                          const IconComponent = brandIconMap[product.icon] || brandIconMap[product.name];
                          return <IconComponent className="w-full h-full object-contain" />;
                        })()
                      ) : (
                        <i className={`ph-duotone ${product.icon} text-3xl text-slate-400`}></i>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg text-slate-900">{product.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{product.description}</p>

                    <div className="mt-4 flex items-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${totalStock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {totalStock > 0 ? (hasVariants ? `${product.variants?.length} Pilihan Varian` : `Sisa Stok: ${totalStock}`) : "Stok Habis"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        {displayOriginalPrice > displayPrice && !hasVariants && (
                          <span className="text-xs text-slate-400 line-through">
                            Rp {displayOriginalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                        {hasVariants && (
                          <span className="text-xs font-semibold text-slate-500 mb-0.5 block">Mulai dari</span>
                        )}
                        <div className="flex items-end gap-1">
                          <span className="text-2xl font-display font-extrabold text-slate-900">
                            {formatPrice(displayPrice)}
                          </span>
                        </div>
                      </div>
                      {!hasVariants && discount && (
                        <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-500 text-xs font-bold">
                          {discount}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (hasVariants) {
                           setSelectedProductForVariant(product);
                        } else {
                           onAddToCart({ id: product.id, name: product.name, price: product.price });
                        }
                      }}
                      disabled={totalStock <= 0}
                      className={`mt-4 w-full py-3 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${hasVariants ? 'bg-slate-900 hover:bg-slate-800' : 'btn-primary'}`}
                    >
                      {totalStock <= 0 ? (
                        <><i className="ph-duotone ph-x-circle text-base"></i> Stok Habis</>
                      ) : hasVariants ? (
                        <><i className="ph-duotone ph-list text-base"></i> Pilih Varian</>
                      ) : (
                        <><i className="ph-duotone ph-shopping-cart-simple text-base"></i> Tambah ke Keranjang</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedProductForVariant && (
        <ProductVariantModal
           product={selectedProductForVariant}
           isOpen={!!selectedProductForVariant}
           onClose={() => setSelectedProductForVariant(null)}
           onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
}
