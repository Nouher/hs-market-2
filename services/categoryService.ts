import { db } from './firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Category } from '../types';

const COLLECTION_NAME = 'categories';

export const getCategories = async (): Promise<Category[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Category[];
    } catch (e) {
        console.error("Error getting categories: ", e);
        return [];
    }
};

export const addCategory = async (name: string): Promise<Category> => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), { name });
        return { id: docRef.id, name };
    } catch (e) {
        console.error("Error adding category: ", e);
        throw e;
    }
};

export const deleteCategory = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
        console.error("Error deleting category: ", e);
        throw e;
    }
};