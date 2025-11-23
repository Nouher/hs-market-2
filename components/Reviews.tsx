import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { ReviewData } from '../types';
import { generateReviews } from '../services/geminiService';

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch reviews once on mount
    const fetchReviews = async () => {
      try {
        const data = await generateReviews();
        setReviews(data);
      } catch (e) {
        console.error("Error loading reviews", e);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
      return (
          <div className="bg-white py-12 text-center">
              <p className="text-gray-500 animate-pulse">جاري تحميل آراء العملاء...</p>
          </div>
      )
  }

  return (
    <section id="reviews" className="bg-white py-12 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">شنو قالو الناس علينا</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm text-right">
              <div className="flex items-center justify-end gap-1 text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">"{review.text}"</p>
              <div className="flex items-center justify-end gap-3 flex-row-reverse">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-xs">
                    {review.author.charAt(0)}
                </div>
                <p className="font-semibold text-sm text-gray-900">{review.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;