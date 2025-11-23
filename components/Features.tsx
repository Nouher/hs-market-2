import React, { useEffect, useRef } from 'react';
import { Battery, Music, ShieldCheck, Truck, Zap } from 'lucide-react';

const Features: React.FC = () => {
  const soundBgRef = useRef<HTMLDivElement>(null);
  const deliveryBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      const scrollY = window.scrollY;
      
      // Parallax for Sound card background
      if (soundBgRef.current) {
        // Original position was translate(-50%, 50%). We add a subtle Y offset based on scroll.
        // Moving the background slightly down (positive Y) as we scroll down creates a depth effect (appears further away).
        soundBgRef.current.style.transform = `translate3d(-50%, calc(50% + ${scrollY * 0.1}px), 0)`;
      }

      // Parallax for Delivery card background
      if (deliveryBgRef.current) {
         // Simple vertical translation for the background blob
         deliveryBgRef.current.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gray-50 py-24" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-base font-bold uppercase tracking-wide text-amber-600">أكثر من مجرد سماعة</h2>
          <p className="mt-2 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl leading-tight">
            كل المميزات اللي كتحلم بها. <br /> بأقل تكلفة ممكنة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
          
          {/* Feature 1: Sound (Large) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group z-0">
            <div className="relative z-10 max-w-md text-right w-full">
              <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
                <Music className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">صوت محيطي 360°</h3>
              <p className="text-gray-500 text-lg">صوت نقي كيخليك تعيش وسط الموسيقى. باس (Bass) قوي وصوت واضح كينافس السماعات الأصلية.</p>
            </div>
            {/* Parallax Background Element */}
            <div 
              ref={soundBgRef}
              className="absolute left-0 bottom-0 w-64 h-64 bg-gradient-to-tr from-amber-50 to-transparent rounded-full will-change-transform pointer-events-none"
              style={{ transform: 'translate(-50%, 50%)' }}
            ></div>
          </div>

          {/* Feature 2: Battery */}
          <div className="bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-800 text-white flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <Battery className="h-10 w-10 text-green-400 mb-4" />
              <h3 className="text-xl font-bold mb-1">30 ساعة د البطارية</h3>
              <p className="text-gray-400 text-sm">مع علبة الشحن اللاسلكي MagSafe.</p>
            </div>
            <div className="absolute top-4 left-4 transition-transform duration-500 group-hover:scale-110">
              <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400 animate-pulse" />
            </div>
          </div>

          {/* Feature 3: Bonus Case */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-center text-center items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[length:20px_20px]"></div>
            <div className="relative z-10">
              <ShieldCheck className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">غطاء حماية مجاني</h3>
              <p className="text-gray-500 mt-2">قيمته 50 درهم. اختار اللون اللي يعجبك.</p>
            </div>
          </div>

          {/* Feature 4: Delivery */}
          <div className="md:col-span-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-3xl p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between text-white relative overflow-hidden z-0">
            {/* Parallax Background Element */}
            <div 
                ref={deliveryBgRef}
                className="absolute -top-20 -left-20 w-80 h-80 bg-yellow-400/30 rounded-full blur-3xl pointer-events-none will-change-transform"
            ></div>

            <div className="relative z-10 mb-6 sm:mb-0 text-right">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="h-8 w-8 text-amber-100" />
                <h3 className="text-2xl font-bold">توصيل سريع ومجاني</h3>
              </div>
              <p className="text-amber-50 text-lg max-w-md">
                كنوصلو لجميع المدن: الدار البيضاء، الرباط، مراكش، طنجة، وكل المغرب.
                <span className="font-bold text-white block mt-1">الدفع كيكون نقداً عند الاستلام.</span>
              </p>
            </div>
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <span className="block text-3xl font-bold" dir="ltr">24-48h</span>
                <span className="text-xs uppercase tracking-wider opacity-80">مدة التوصيل</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Features;