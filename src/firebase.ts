import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setPersistence, browserSessionPersistence } from "firebase/auth";


const firebaseConfig = {
  apiKey: "REDACTED_API_KEY",
  authDomain: "jadghader-portfolio.firebaseapp.com",
  projectId: "jadghader-portfolio",
  storageBucket: "jadghader-portfolio.firebasestorage.app",
  messagingSenderId: "173949292752",
  appId: "1:173949292752:web:c06858cce56c6b9bdf4ed5",
  measurementId: "G-0NNXC1JPWD",
};
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
