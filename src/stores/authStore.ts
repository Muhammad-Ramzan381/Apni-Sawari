import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppUser, UserRole } from "../types/user";

interface AuthState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOnboarded: boolean;

  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
  setOnboarded: (onboarded: boolean) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isOnboarded: false,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user });
    if (user) {
      AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      AsyncStorage.removeItem("user");
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setOnboarded: (isOnboarded) => {
    set({ isOnboarded });
    AsyncStorage.setItem("onboarded", JSON.stringify(isOnboarded));
  },

  switchRole: (role) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, activeRole: role };
      set({ user: updatedUser });
      AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    AsyncStorage.removeItem("user");
  },
}));
