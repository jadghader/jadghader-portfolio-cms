// src/firebase/firestore.ts
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../firebase";

export const getData = async (
  collection: string,
  docId: string
): Promise<any | null> => {
  try {
    const docRef = doc(db, collection, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn(`Document not found: ${collection}/${docId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error reading document ${collection}/${docId}:`, error);
    return null;
  }
};

export const setData = async (
  collection: string,
  docId: string,
  data: any
): Promise<void> => {
  try {
    const docRef = doc(db, collection, docId);
    await setDoc(docRef, data);
    console.log(`Document written: ${collection}/${docId}`);
  } catch (error) {
    console.error(`Error writing document ${collection}/${docId}:`, error);
    throw error;
  }
};

export const updateData = async (
  collection: string,
  docId: string,
  data: any
): Promise<void> => {
  try {
    const docRef = doc(db, collection, docId);
    await updateDoc(docRef, data);
    console.log(`Document updated: ${collection}/${docId}`);
  } catch (error) {
    console.error(`Error updating document ${collection}/${docId}:`, error);
    throw error;
  }
};

export const deleteData = async (
  collection: string,
  docId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collection, docId);
    await deleteDoc(docRef);
    console.log(`Document deleted: ${collection}/${docId}`);
  } catch (error) {
    console.error(`Error deleting document ${collection}/${docId}:`, error);
    throw error;
  }
};

export const onDocSnapshot = (
  collection: string,
  docId: string,
  callback: (data: any) => void
): Unsubscribe => {
  try {
    const docRef = doc(db, collection, docId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data());
        } else {
          console.warn(`Document not found: ${collection}/${docId}`);
          callback(null);
        }
      },
      (error) => {
        console.error(`Error listening to document ${collection}/${docId}:`, error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error(`Error setting up listener for ${collection}/${docId}:`, error);
    return () => {};
  }
};

export const onResumeUrlSnapshot = (
  callback: (url: string | null) => void
): Unsubscribe => {
  return onDocSnapshot("siteContent", "navbar", (data) => {
    callback(data?.resumeUrl || null);
  });
};
