import { initializeApp } from "firebase/app";
import type { FirebaseOptions } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfigRaw = process.env.REACT_APP_FIREBASE_CONFIG;

if (!firebaseConfigRaw) {
  throw new Error("Missing REACT_APP_FIREBASE_CONFIG env var");
}

const firebaseConfig: FirebaseOptions = JSON.parse(
  atob(firebaseConfigRaw)
);

const app = initializeApp(firebaseConfig);

// 📊 Analytics
const analytics = getAnalytics(app);

// 🚀 Performance Monitoring
const performance = getPerformance(app);

// 🛡 App Check
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(
    process.env.REACT_APP_RECAPTCHA_V3_SITE_KEY!
  ),
  isTokenAutoRefreshEnabled: true,
});

// 🔐 Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// 🗄 Firestore
const db = getFirestore(app);

// Session persistence
setPersistence(auth, browserSessionPersistence);

export {
  app,
  auth,
  db,
  analytics,
  performance,
  googleProvider,
};