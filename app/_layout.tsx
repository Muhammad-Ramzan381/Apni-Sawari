import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSettingsStore } from "../src/stores/settingsStore";
import { useAuth } from "../src/hooks/useAuth";
import "../src/i18n";
import "../global.css";

export default function RootLayout() {
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  // Subscribe to Firebase auth state changes
  useAuth();

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(rider)" />
        <Stack.Screen name="(driver)" />
      </Stack>
    </GestureHandlerRootView>
  );
}
