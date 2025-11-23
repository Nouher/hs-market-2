import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';

interface HeroProps {
  onScrollToOrder: () => void;
}

const Hero: React.FC<HeroProps> = ({ onScrollToOrder }) => {
  return (
    <div id="hero" className="relative bg-white pt-10 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Social Proof Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-100 transition-colors cursor-default">
            <Star className="h-4 w-4 ml-1.5 text-yellow-500 fill-yellow-500" /> 
            <span>السماعة الأكثر طلباً في 2024</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl font-black tracking-tight text-gray-900 sm:text-7xl mb-6 leading-tight">
          جودة احترافية. <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-500 to-yellow-600">
            بثمن خيالي.
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed">
          عيش تجربة الجيل الرابع. عزل صوتي، بطارية كدوم 24 ساعة، وتصميم مريح للأذن. 
          <span className="block mt-2 font-bold text-gray-900">علاش تخلص 2000 درهم ملي تقدر تخلص غير 190 درهم؟</span>
        </p>

        {/* Pricing and CTA */}
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex items-baseline gap-3 dir-ltr">
            <span className="text-xl text-gray-400 line-through decoration-2">450 DH</span>
            <span className="text-6xl font-black text-gray-900 tracking-tight">190<span className="text-3xl align-top mr-1">DH</span></span>
          </div>
          
          <div className="w-full max-w-xs sm:max-w-sm space-y-3">
            <button
              onClick={onScrollToOrder}
              className="w-full flex items-center justify-center rounded-full bg-gray-900 px-8 py-4 text-lg font-bold text-white hover:bg-gray-800 hover:scale-[1.02] transition-all shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <ShoppingBag className="ml-2 h-5 w-5" />
              اطلب الآن - والدفع عند الاستلام
            </button>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              توصيل مجاني • غطاء هدية • ضمان الجودة
            </p>
          </div>
        </div>

        {/* Hero Image / Visuals */}
        <div className="mt-16 sm:mt-24 relative">
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] bg-gradient-to-tr from-amber-100 to-yellow-100 rounded-full blur-3xl opacity-70"></div>
          </div>
          <img
            className="relative mx-auto w-full max-w-4xl rounded-3xl shadow-2xl ring-1 ring-gray-900/5 lg:max-w-5xl object-cover transform hover:scale-[1.01] transition-transform duration-700"
            src="./product-image.jpg"
            alt="سماعات SonicPod Gen 4 مع علب الضمان والأغطية الملونة"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;