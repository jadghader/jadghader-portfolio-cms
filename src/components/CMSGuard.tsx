import { useEffect, useState, type ReactNode } from "react";
import { onIdTokenChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { isAllowedEditorEmail } from "../utils/cmsAccess";

interface CMSGuardProps {
  children: ReactNode;
}

export function CMSGuard({ children }: CMSGuardProps) {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      try {
        if (user) {
          const allowed = await isAllowedEditorEmail(user.email);
          if (!allowed) {
            await signOut(auth);
          }
        }
      } finally {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (checking) return null;
  return <>{children}</>;
}
