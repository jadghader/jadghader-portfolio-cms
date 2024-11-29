import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import Cookies from "js-cookie";
interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  logout: () => {},
});

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

export const useAuth = () => useContext(AuthContext);
