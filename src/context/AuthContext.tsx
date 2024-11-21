import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import Cookies from "js-cookie"; // Import js-cookie for managing cookies

// Define the type for AuthContext
interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  logout: () => {},
});

// Define the props for the AuthProvider, including `children`
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const token = await currentUser.getIdTokenResult();
        const adminStatus = !!token.claims?.admin; // Ensure it's a boolean
        setIsAdmin(adminStatus);

        // Store token and admin status securely in cookies
        Cookies.set("authToken", token.token, {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        }); // Cookie with token
        Cookies.set("isAdmin", adminStatus.toString(), {
          expires: 7,
          secure: true,
          sameSite: "Strict",
        }); // Admin status
      } else {
        setIsAdmin(false);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    auth.signOut();
    setUser(null);
    setIsAdmin(false);
    Cookies.remove("authToken");
    Cookies.remove("isAdmin");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
