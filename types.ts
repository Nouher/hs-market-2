
export enum CaseColor {
  RED = 'Red',
  BLACK = 'Black',
  PINK = 'Pink',
  GREEN = 'Green'
}

export interface ReviewData {
  author: string;
  rating: number;
  text: string;
}

export interface OrderFormData {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  selectedColor: CaseColor;
}

export interface Order extends OrderFormData {
  id: string;
  createdAt: string;
  status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description: string;
  category?: string;
}

export const CASE_COLOR_MAP: Record<CaseColor, string> = {
  [CaseColor.RED]: 'bg-red-500',
  [CaseColor.BLACK]: 'bg-gray-900',
  [CaseColor.PINK]: 'bg-pink-400',
  [CaseColor.GREEN]: 'bg-green-500',
};