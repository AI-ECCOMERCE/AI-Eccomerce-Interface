import React, { useState } from "react";
import { brandIconMap } from "./BrandIcons";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

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
  description: string;
  price: number;
  original_price: number;
  stock: number;
  icon: string;
  gradient: string;
  badge_text?: string;
  badge_color?: string;
  variants?: Variant[];
}

interface ProductVariantModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: { id: string; name: string; price: number }) => void;
}

export default function ProductVariantModal({ product, isOpen, onClose, onAddToCart }: ProductVariantModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants?.[0] || null
  );

  if (!isOpen) return null;

  const handleAddToCart = () => {
    if (selectedVariant && selectedVariant.stock > 0) {
      onAddToCart({
        id: selectedVariant.id,
        name: `${product.name} - ${selectedVariant.name}`,
        price: selectedVariant.price,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-slideUp sm:animate-scaleIn z-10">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-2 shadow-sm">
                {brandIconMap[product.icon] || brandIconMap[product.name] ? (
                  (() => {
                    const IconComponent = brandIconMap[product.icon] || brandIconMap[product.name];
                    return <IconComponent className="w-full h-full object-contain" />;
                  })()
                ) : (
                  <i className={`ph-duotone ${product.icon} text-2xl text-slate-400`}></i>
                )}
             </div>
             <div>
                <h3 className="font-display font-bold text-lg text-slate-900">{product.name}</h3>
                <p className="text-xs text-slate-500">Pilih varian langganan</p>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <i className="ph-duotone ph-x text-xl"></i>
          </button>
        </div>

        <div className="p-5 sm:p-6 bg-slate-50/50">
          <div className="space-y-3">
            {product.variants?.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const isOutOfStock = variant.stock <= 0;
              
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
                        Rp {variant.original_price.toLocaleString('id-ID')}
                      </p>
                    )}
                    <p className={`font-extrabold font-display ${isSelected ? 'text-brand-700' : 'text-slate-900'}`}>
                      {formatPrice(variant.price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-6 border-t border-slate-100 bg-white">
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock <= 0}
            className="w-full btn-primary py-3.5 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-brand-500/25"
          >
            {selectedVariant && selectedVariant.stock <= 0 ? (
              <>
                <i className="ph-duotone ph-x-circle text-lg"></i>
                Stok Varian Habis
              </>
            ) : (
              <>
                <i className="ph-duotone ph-shopping-cart-simple text-lg"></i>
                Tambah {selectedVariant ? selectedVariant.name : ''} ke Keranjang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
