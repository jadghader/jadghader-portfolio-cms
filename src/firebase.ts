import { initializeApp } from "firebase/app";
import type { FirebaseOptions } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfigRaw = process.env.REACT_APP_FIREBASE_CONFIG;
if (!firebaseConfigRaw) {
  throw new Error("Missing REACT_APP_FIREBASE_CONFIG env var");
}

const decodeBase64 = (value: string): string => {
  if (typeof atob === "function") {
    return atob(value);
  }
  return Buffer.from(value, "base64").toString("utf-8");
};

let firebaseConfig: FirebaseOptions;
try {
  firebaseConfig = JSON.parse(decodeBase64(firebaseConfigRaw)) as FirebaseOptions;
} catch {
  throw new Error(
    "REACT_APP_FIREBASE_CONFIG must be a valid base64-encoded JSON string"
  );
}


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Change the persistence to session storage
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Auth persistence set to session storage");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export { app, auth, db, analytics, googleProvider };
