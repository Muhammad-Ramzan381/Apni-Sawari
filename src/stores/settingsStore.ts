import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "../types/user";
import i18n from "../i18n";

interface SettingsState {
  language: Language;
  isDarkMode: boolean;

  setLanguage: (language: Language) => void;
  toggleDarkMode: () => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  language: "en",
  isDarkMode: false,

  setLanguage: (language) => {
    i18n.changeLanguage(language);
    set({ language });
    AsyncStorage.setItem("language", language);
  },

  toggleDarkMode: () =>
    set((state) => {
      const isDarkMode = !state.isDarkMode;
      AsyncStorage.setItem("darkMode", JSON.stringify(isDarkMode));
      return { isDarkMode };
    }),

  loadSettings: async () => {
    const language = (await AsyncStorage.getItem("language")) as Language | null;
    const darkMode = await AsyncStorage.getItem("darkMode");

    if (language) {
      i18n.changeLanguage(language);
      set({ language });
    }
    if (darkMode) {
      set({ isDarkMode: JSON.parse(darkMode) });
    }
  },
}));
