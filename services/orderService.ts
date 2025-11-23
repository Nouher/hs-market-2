import { db } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { Order, OrderFormData } from '../types';

const COLLECTION_NAME = 'orders';

export const saveOrder = async (data: OrderFormData): Promise<Order> => {
  try {
    const orderData = {
        ...data,
        createdAt: new Date().toISOString(),
        status: 'new',
        totalPrice: 190 
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), orderData);
    
    return {
        id: docRef.id,
        ...orderData
    } as Order;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Order[];
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  try {
    const orderRef = doc(db, COLLECTION_NAME, orderId);
    await updateDoc(orderRef, { status });
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};