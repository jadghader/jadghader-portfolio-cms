// src/firebase/auth.ts
import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { auth } from "../firebase";

// Login with Email and Password
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error during email login: ", error);
    return null;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during logout: ", error);
  }
};
