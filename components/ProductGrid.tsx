
import React from 'react';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductSelect }) => {
  return (
    <div id="hero" className="bg-gray-50 min-h-screen">
      {/* Store Hero Banner */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl"></div>
           <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6">
            أفضل <span className="text-amber-500">التكنولوجيا</span><br />بأفضل الأسعار
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            اكتشف مجموعتنا المختارة من السماعات والإكسسوارات عالية الجودة. 
            جودة مضمونة، توصيل مجاني، والدفع عند الاستلام.
          </p>
          <div className="flex justify-center gap-4">
             <button onClick={() => document.getElementById('grid')?.scrollIntoView({behavior: 'smooth'})} className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                تصفح المنتجات
             </button>
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div id="grid" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-900">أحدث المنتجات</h2>
            <div className="h-1 flex-1 mx-6 bg-gray-200 rounded-full"></div>
        </div>

        {products.length === 0 ? (
             <div className="text-center py-20">
                <p className="text-gray-500 text-lg">جاري إضافة المنتجات...</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
                <div 
                    key={product.id} 
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                    {/* Image Area */}
                    <div 
                        className="relative aspect-[4/4] overflow-hidden bg-gray-100 cursor-pointer"
                        onClick={() => onProductSelect(product)}
                    >
                        <img 
                            src={product.image || './product-image.jpg'} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                        <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                            توصيل مجاني
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-1 flex flex-col">
                        <div className="mb-1 flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500 font-medium">4.9 (150 تقييم)</span>
                        </div>
                        <h3 
                            className="text-lg font-bold text-gray-900 mb-2 cursor-pointer hover:text-amber-600 transition-colors"
                            onClick={() => onProductSelect(product)}
                        >
                            {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                            {product.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                            <div className="flex flex-col">
                                {product.originalPrice && (
                                    <span className="text-xs text-gray-400 line-through">{product.originalPrice} DH</span>
                                )}
                                <span className="text-xl font-black text-amber-600">{product.price} DH</span>
                            </div>
                            <button 
                                onClick={() => onProductSelect(product)}
                                className="bg-gray-900 text-white h-10 w-10 rounded-full flex items-center justify-center hover:bg-amber-600 hover:scale-110 transition-all shadow-md"
                                aria-label="Add to cart"
                            >
                                <ShoppingBag className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
