import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Store, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: 'store' | 'collections' | 'contact') => void;
  currentView: 'store' | 'collections' | 'product' | 'admin';
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (target: 'store' | 'collections' | 'contact') => {
    onNavigate(target);
    setIsOpen(false);
  };

  return (
    <nav 
      className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-100 py-2' 
          : 'bg-white border-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer" 
            onClick={() => handleNavClick('store')}
          >
            <img 
              src="https://i.ibb.co/Cp6JCdtN/Artboard-4-4x-Y-35-XIWm-Ad-S7h-YKr-UGHBkk-Wg-Fr-Hn-F.png" 
              alt="HSMarket Logo" 
              className="h-12 w-auto object-contain" 
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
             <button 
               onClick={() => handleNavClick('store')} 
               className={`font-bold text-sm transition-colors hover:text-gold-600 ${currentView === 'store' ? 'text-gold-600' : 'text-gray-600'}`}
             >
                الرئيسية
             </button>
             <button 
               onClick={() => handleNavClick('collections')} 
               className={`font-bold text-sm transition-colors hover:text-gold-600 ${currentView === 'collections' ? 'text-gold-600' : 'text-gray-600'}`}
             >
                المجموعات
             </button>
             <button 
               onClick={() => handleNavClick('contact')} 
               className="text-gray-600 hover:text-gold-600 font-bold text-sm transition-colors"
             >
                اتصل بنا
             </button>
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleNavClick('store')}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:to-gold-600 transition-all shadow-lg hover:shadow-gold-500/20 transform hover:-translate-y-0.5"
            >
              {currentView === 'product' ? <Store className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {currentView === 'product' ? 'عودة للمتجر' : 'اطلب الآن'}
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="p-4 space-y-3">
            <button onClick={() => handleNavClick('store')} className="block w-full text-right px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-bold">
                الرئيسية
            </button>
             <button onClick={() => handleNavClick('collections')} className="block w-full text-right px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-bold flex items-center justify-end gap-2">
                المجموعات
                <LayoutGrid className="w-4 h-4 opacity-50" />
            </button>
             <button onClick={() => handleNavClick('contact')} className="block w-full text-right px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-bold">
                اتصل بنا
            </button>
            <div className="h-px bg-gray-100 my-2"></div>
            <button 
              onClick={() => handleNavClick('store')}
              className="flex w-full items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-gray-800 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              اطلب الآن
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
