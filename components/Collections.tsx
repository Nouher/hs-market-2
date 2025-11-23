
import React, { useEffect, useState } from 'react';
import { Headphones, Watch, Smartphone, Zap, ArrowRight, ShoppingBag, LayoutGrid } from 'lucide-react';
import { getCategories } from '../services/categoryService';
import { getProducts } from '../services/productService';
import { Category, Product } from '../types';

interface CollectionsProps {
  onCategoryClick: (category: string) => void;
}

const Collections: React.FC<CollectionsProps> = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
              setCategories(cats);
              setProducts(prods);
          } catch (e) {
              console.error("Failed to load collections", e);
          }
      };
      fetchData();
  }, []);

  const getProductCount = (categoryId: string) => {
      return products.filter(p => p.category === categoryId).length;
  };

  const getCategoryIcon = (id: string) => {
      if (id.includes('headphone') || id.includes('audio')) return <Headphones className="w-8 h-8 text-white" />;
      if (id.includes('watch') || id.includes('smart')) return <Watch className="w-8 h-8 text-white" />;
      if (id.includes('phone') || id.includes('access')) return <Smartphone className="w-8 h-8 text-white" />;
      return <LayoutGrid className="w-8 h-8 text-white" />;
  };

  // Colors for variation
  const colors = [
      'from-purple-500 to-indigo-600',
      'from-amber-500 to-orange-600',
      'from-blue-500 to-cyan-600',
      'from-red-500 to-pink-600',
      'from-emerald-500 to-teal-600',
      'from-gray-700 to-gray-900'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Collections Hero */}
      <div className="relative bg-gray-900 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900"></div>
        
        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            اكتشف <span className="text-gold-500">مجموعاتنا</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            تصفح أحدث المنتجات الإلكترونية حسب الفئة. جودة عالية وضمان شامل.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <div 
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colors[idx % colors.length]}`}></div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                      {getCategoryIcon(cat.id)}
                   </div>
                   <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {getProductCount(cat.id)} منتج
                   </span>
                </div>

                <div>
                  <h3 className="text-3xl font-black text-white mb-2">{cat.name}</h3>
                  <div className="flex items-center text-white/80 group-hover:text-white transition-colors font-bold gap-2">
                    <span>تصفح المنتجات</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:-translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
              <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">لا توجد تصنيفات حالياً.</p>
              </div>
          )}
        </div>

        {/* Banner Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="text-center md:text-right">
              <h2 className="text-3xl font-black text-gray-900 mb-4">ما لقيتيش داكشي لي بغيتي؟</h2>
              <p className="text-gray-500 text-lg max-w-md">
                 كنضيفو منتجات جديدة كل أسبوع. اشترك فالنشرة البريدية باش توصل بالجديد.
              </p>
           </div>
           <button 
             onClick={() => onCategoryClick('all')}
             className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gold-600 transition-colors flex items-center gap-3 shadow-lg"
           >
              <ShoppingBag className="w-5 h-5" />
              مشاهدة كل المنتجات
           </button>
        </div>
      </div>
    </div>
  );
};

export default Collections;
