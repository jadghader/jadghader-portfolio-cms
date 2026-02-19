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

/**
 * Read a single document from Firestore (one-time fetch)
 * @param collection Collection name
 * @param docId Document ID
 * @returns Document data or null
 */
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

/**
 * Write or create a document in Firestore
 * @param collection Collection name
 * @param docId Document ID
 * @param data Data to write
 */
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

/**
 * Update specific fields in a document
 * @param collection Collection name
 * @param docId Document ID
 * @param data Partial data to update
 */
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

/**
 * Delete a document from Firestore
 * @param collection Collection name
 * @param docId Document ID
 */
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

/**
 * Subscribe to real-time updates for a single document
 * @param collection Collection name
 * @param docId Document ID
 * @param callback Callback function called when document changes
 * @returns Unsubscribe function to stop listening
 */
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

/**
 * Subscribe to resume URL changes from navbar document
 * @param callback Callback function called when resume URL changes
 * @returns Unsubscribe function to stop listening
 */
export const onResumeUrlSnapshot = (
  callback: (url: string | null) => void
): Unsubscribe => {
  return onDocSnapshot("siteContent", "navbar", (data) => {
    callback(data?.resumeUrl || null);
  });
};
