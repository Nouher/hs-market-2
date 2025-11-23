
import { db, storage } from './firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product } from '../types';

const COLLECTION_NAME = 'products';

// Helper to remove undefined fields because Firestore doesn't accept them
const cleanData = (data: any) => {
    return Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
    );
};

export const getProducts = async (): Promise<Product[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];

        if (products.length === 0) {
            return []; 
        }
        return products;
    } catch (e) {
        console.error("Error getting products: ", e);
        return [];
    }
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
        const sanitizedProduct = cleanData(product);
        const docRef = await addDoc(collection(db, COLLECTION_NAME), sanitizedProduct);
        return { id: docRef.id, ...product };
    } catch (e) {
        console.error("Error adding product: ", e);
        throw e;
    }
};

export const updateProduct = async (product: Product): Promise<void> => {
    try {
        const { id, ...data } = product;
        const sanitizedData = cleanData(data);
        const productRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(productRef, sanitizedData);
    } catch (e) {
        console.error("Error updating product: ", e);
        throw e;
    }
};

export const deleteProduct = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
        console.error("Error deleting product: ", e);
        throw e;
    }
};

export const uploadProductImage = async (file: File): Promise<string> => {
    try {
        // Create a unique filename
        const filename = `products/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, filename);
        
        // Upload file
        const snapshot = await uploadBytes(storageRef, file);
        
        // Get public URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (e) {
        console.error("Error uploading image: ", e);
        throw e;
    }
};