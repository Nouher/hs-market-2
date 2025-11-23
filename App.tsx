
import React, { useEffect, useState } from 'react';
import Features from './components/Features';
import Reviews from './components/Reviews';
import OrderForm from './components/OrderForm';
import ProductGrid from './components/ProductGrid';
import AdminDashboard from './components/AdminDashboard';
import Collections from './components/Collections';
import Navbar from './components/Navbar';
import { getProducts } from './services/productService';
import { Product } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'store' | 'collections' | 'product' | 'admin'>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple URL check to route to admin
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'admin') {
      setView('admin');
    }
    
    // Load products on mount (Async)
    const loadData = async () => {
        const data = await getProducts();
        setProducts(data);
        setLoading(false);
    };
    loadData();
  }, []);

  const handleNavigate = (target: 'store' | 'collections' | 'contact') => {
    if (target === 'store') {
      setView('store');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'collections') {
      setView('collections');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'contact') {
      // Determine if we are on a page with the footer
      if (view === 'admin') {
          setView('store');
          setTimeout(() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      } else {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (category: string) => {
    // In a real app, we would filter products here.
    // For now, we route back to the store grid.
    setView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (view === 'admin') {
    return <AdminDashboard onBack={() => {
        window.history.pushState({}, '', window.location.pathname);
        setView('store');
        // Reload products when returning from admin in case of updates
        getProducts().then(setProducts); 
    }} />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Promo Bar */}
      <div className="bg-gray-900 text-white text-center py-2.5 px-4 text-xs sm:text-sm font-medium shadow-sm relative z-50">
        <span className="ml-2">🎉</span> 
        <span className="opacity-90 text-gold-400">عرض خاص: <span className="text-white">احصل على</span> غطاء مجاني <span className="text-white">عند الطلب اليوم.</span></span>
      </div>

      {/* Sticky Navbar */}
      <Navbar onNavigate={handleNavigate} currentView={view} />

      <main className="flex-grow">
        
        {view === 'store' && (
            <>
                {loading ? (
                    <div className="h-screen flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
                    </div>
                ) : (
                    <ProductGrid products={products} onProductSelect={handleProductSelect} />
                )}
                <Features />
                <Reviews />
            </>
        )}

        {view === 'collections' && (
            <Collections onCategoryClick={handleCategoryClick} />
        )}

        {view === 'product' && (
            <OrderForm 
                id="hero" 
                product={selectedProduct} 
                onBack={() => setView('store')}
            />
        )}
        
      </main>
      
      <footer id="contact" className="bg-gray-50 border-t border-gray-200 pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4">HSMarket</h2>
          <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto leading-relaxed">
            وجهتك الأولى للإلكترونيات عالية الجودة في المغرب. نضمن لك أفضل تجربة شراء مع خدمة ما بعد البيع متميزة.
          </p>
          <div className="flex justify-center gap-6 mb-8">
             <a href="#" className="text-gray-400 hover:text-gold-600 transition-colors"><span className="sr-only">Facebook</span>FB</a>
             <a href="#" className="text-gray-400 hover:text-gold-600 transition-colors"><span className="sr-only">Instagram</span>IG</a>
             <a href="#" className="text-gray-400 hover:text-gold-600 transition-colors"><span className="sr-only">Twitter</span>TW</a>
          </div>
          <p className="text-gray-400 text-xs">&copy; 2024 HSMarket. جميع الحقوق محفوظة.</p>
          <div className="mt-4">
            <button onClick={() => setView('admin')} className="text-gray-300 hover:text-gray-500 text-[10px]">
              Admin Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
