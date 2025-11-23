
import React, { useState } from 'react';
import { Check, ShieldCheck, Truck, Lock, ChevronRight, ChevronLeft, Star, ArrowRight, MessageCircle } from 'lucide-react';
import { CaseColor, OrderFormData, Product } from '../types';
import { saveOrder } from '../services/orderService';
import Features from './Features';
import Reviews from './Reviews';

interface OrderFormProps {
  id?: string;
  product?: Product | null;
  onBack?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ id, product, onBack }) => {
  // Default fallback product if none provided
  const displayProduct = product || {
    id: 'default',
    name: 'SonicPod Gen 4',
    price: 190,
    image: './product-image.jpg',
    description: 'سماعات بلوتوث لاسلكية مع خاصية العزل الصوتي وعلبة حماية مجانية.'
  };

  // Use product images gallery if available, otherwise just the main image
  const productImages = (displayProduct.images && displayProduct.images.length > 0)
    ? displayProduct.images
    : [displayProduct.image, displayProduct.image, displayProduct.image, displayProduct.image]; // Fallback to repeat if no gallery

  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    selectedColor: CaseColor.BLACK, // Default
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        // Inject product info into the saved order if you want to track it (needs backend/type update, but keeping simple for now)
        // For now just saving the order details
        await saveOrder(formData);
        setIsSubmitted(true);
    } catch (error) {
        console.error("Failed to save order", error);
        alert("حدث خطأ أثناء الطلب، المرجو المحاولة مرة أخرى.");
    } finally {
        setLoading(false);
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Display names in Arabic
  const arabicColorNames: Record<CaseColor, string> = {
    [CaseColor.RED]: 'أحمر',
    [CaseColor.BLACK]: 'أسود',
    [CaseColor.PINK]: 'وردي',
    [CaseColor.GREEN]: 'أخضر',
  };

  const displayColorMap: Record<CaseColor, string> = {
    [CaseColor.RED]: 'bg-[#E11D48]',
    [CaseColor.BLACK]: 'bg-[#1F2937]',
    [CaseColor.PINK]: 'bg-[#F472B6]',
    [CaseColor.GREEN]: 'bg-[#22C55E]',
  };

  if (isSubmitted) {
    return (
      <div id={id} className="bg-gray-50 py-24 px-4 text-center min-h-[600px] flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50 mb-6">
            <Check className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">تم استلام طلبك بنجاح!</h2>
          <p className="text-gray-500 mb-8">
            شكراً لك، {formData.fullName.split(' ')[0]}! سنتصل بك على الرقم <strong className="text-gray-900" dir="ltr">{formData.phoneNumber}</strong> لتأكيد الطلب.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
             <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>المبلغ المطلوب:</span>
                <span className="font-bold text-gray-900">{displayProduct.price} درهم</span>
             </div>
             <div className="flex justify-between text-sm text-gray-600">
                <span>المنتج:</span>
                <span className="font-bold text-gray-900">{displayProduct.name}</span>
             </div>
          </div>

          <div className="space-y-3">
            <button 
               onClick={() => {
                   setIsSubmitted(false);
                   setFormData(prev => ({...prev, fullName: '', phoneNumber: '', address: ''}));
               }}
               className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              طلب منتج آخر
            </button>
            {onBack && (
                <button 
                    onClick={onBack}
                    className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    العودة للمتجر
                </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className="bg-white pt-10 pb-0 border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        
        {onBack && (
            <button 
                onClick={onBack}
                className="mb-8 flex items-center text-gray-500 hover:text-gray-900 transition-colors font-bold"
            >
                <ArrowRight className="w-5 h-5 ml-2" />
                العودة للمتجر
            </button>
        )}

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start">
          
          {/* --- Left Column: Image Gallery --- */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-28">
            {/* Main Image Viewer */}
            <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-sm mb-4 group border border-gray-100">
              <img 
                src={productImages[activeImageIndex]} 
                alt={`Product view ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Navigation Arrows (Only if multiple images) */}
              {productImages.length > 1 && (
                  <>
                    <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
              )}

              {displayProduct.originalPrice && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                   -{Math.round(((displayProduct.originalPrice - displayProduct.price) / displayProduct.originalPrice) * 100)}% عرض خاص
                </div>
              )}
            </div>

            {/* Thumbnails Grid */}
            {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {productImages.map((img, idx) => (
                    <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx 
                        ? 'border-gold-500 ring-2 ring-gold-500/20' 
                        : 'border-transparent hover:border-gray-200'
                    }`}
                    >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
                </div>
            )}

            {/* Trust Badges (Desktop) */}
            <div className="hidden lg:flex items-center justify-center gap-6 mt-8 text-gray-500 text-sm font-medium">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-gray-400" />
                  <span>ضمان الجودة</span>
               </div>
               <div className="w-px h-4 bg-gray-300"></div>
               <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <span>توصيل مجاني</span>
               </div>
               <div className="w-px h-4 bg-gray-300"></div>
               <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-gray-400" />
                  <span>الدفع عند الاستلام</span>
               </div>
            </div>
          </div>


          {/* --- Right Column: Order Form --- */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 relative overflow-hidden">
               <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-500 to-gold-600"></div>
               
              {/* Product Header */}
              <div className="mb-6 border-b border-gray-100 pb-6">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="flex text-gold-400">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">(+1200 تقييم)</span>
                 </div>
                 <h1 className="text-3xl font-black text-gray-900 mb-2">{displayProduct.name}</h1>
                 <p className="text-gray-500 text-sm mb-4">{displayProduct.description}</p>
                 
                 <div className="flex items-baseline gap-3 dir-ltr">
                    <span className="text-4xl font-black text-gold-600 tracking-tight">{displayProduct.price}<span className="text-xl align-top mr-1">DH</span></span>
                    {displayProduct.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">{displayProduct.originalPrice} DH</span>
                    )}
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Color Selection Section */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-gray-900">اختر لون الغطاء (مجاناً):</span>
                        <span className="text-xs font-bold text-gold-600">{arabicColorNames[formData.selectedColor]}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {Object.values(CaseColor).map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, selectedColor: color }))}
                            className={`
                            group relative h-12 w-12 rounded-full shadow-sm focus:outline-none transition-all duration-200
                            ${displayColorMap[color]}
                            ${formData.selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-white ring-gold-500 scale-110' : 'hover:scale-105 opacity-90 hover:opacity-100'}
                            `}
                            aria-label={`Select ${color} case`}
                        >
                            {formData.selectedColor === color && (
                            <span className="absolute inset-0 flex items-center justify-center">
                                <Check className="h-5 w-5 text-white drop-shadow-sm" />
                            </span>
                            )}
                        </button>
                        ))}
                    </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-bold text-gray-700 mb-1.5">الاسم الكامل</label>
                        <input
                        type="text"
                        name="fullName"
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="الاسم والنسب"
                        className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-gold-500 focus:bg-white focus:ring-gold-500 sm:text-sm p-3.5 transition-all outline-none border text-right"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700 mb-1.5">رقم الهاتف</label>
                            <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            required
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="06 XX XX XX XX"
                            className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-gold-500 focus:bg-white focus:ring-gold-500 sm:text-sm p-3.5 transition-all outline-none border text-right"
                            dir="ltr"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-1.5">المدينة</label>
                            <select
                            name="city"
                            id="city"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-gold-500 focus:bg-white focus:ring-gold-500 sm:text-sm p-3.5 transition-all outline-none border text-right bg-none"
                            >
                            <option value="">اختر مدينتك...</option>
                            <option value="Casablanca">الدار البيضاء</option>
                            <option value="Rabat">الرباط</option>
                            <option value="Marrakech">مراكش</option>
                            <option value="Tanger">طنجة</option>
                            <option value="Agadir">أكادير</option>
                            <option value="Fes">فاس</option>
                            <option value="Meknes">مكناس</option>
                            <option value="Oujda">وجدة</option>
                            <option value="Other">مدينة أخرى</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-1.5">العنوان</label>
                        <input
                        type="text"
                        name="address"
                        id="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="الحي، رقم الزنقة، المنزل..."
                        className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-gold-500 focus:bg-white focus:ring-gold-500 sm:text-sm p-3.5 transition-all outline-none border text-right"
                        />
                    </div>
                </div>

                {/* Order Summary & Submit */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mt-2">
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="text-gray-600">التوصيل</span>
                    <span className="text-green-600 font-bold">مجاني 100%</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-gray-900 text-lg">المجموع</span>
                    <span className="font-black text-2xl text-gold-600">{displayProduct.price} درهم</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full group flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:to-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01]"
                  >
                    {loading ? (
                      <span className="animate-pulse">جاري التسجيل...</span>
                    ) : (
                      <>
                        اضغط هنا للطلب الآن 
                        <ChevronLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* WhatsApp Button */}
                  <button 
                    type="button"
                    onClick={() => window.open('https://wa.me/212600000000?text=سلام، بغيت نسول على هذا المنتج', '_blank')}
                    className="w-full mt-3 flex justify-center items-center py-3 px-4 border-2 border-green-500 rounded-xl text-lg font-bold text-green-600 hover:bg-green-50 focus:outline-none transition-all"
                  >
                    <MessageCircle className="ml-2 h-5 w-5" />
                    تواصل معنا عبر الواتساب
                  </button>

                  <p className="mt-3 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" />
                    الدفع نقداً عند الاستلام - لا مخاطرة
                  </p>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
      
      {/* Detailed Features and Reviews (Only visible on product page) */}
      <Features />
      <Reviews />
    </div>
  );
};

export default OrderForm;
