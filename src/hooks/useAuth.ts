import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../stores/authStore";
import { subscribeToAuthChanges } from "../services/auth";
import { getUser } from "../services/users";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch their profile from Firestore
        try {
          const appUser = await getUser(firebaseUser.uid);
          if (appUser) {
            setUser(appUser);
          } else {
            // User exists in Firebase Auth but not in Firestore
            // This means they need to complete onboarding
            setUser({
              id: firebaseUser.uid,
              displayName: firebaseUser.displayName || "",
              phone: firebaseUser.phoneNumber || "",
              role: "rider",
              activeRole: "rider",
              language: "en",
              createdAt: Date.now(),
              updatedAt: Date.now(),
            });
          }
        } catch {
          // Failed to fetch user, sign them out
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, isAuthenticated, isLoading };
}
