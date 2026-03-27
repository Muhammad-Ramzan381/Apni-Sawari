import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useAuthStore } from "../src/stores/authStore";
import LoadingSpinner from "../src/components/ui/LoadingSpinner";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/(auth)/welcome");
      return;
    }

    if (user?.activeRole === "driver") {
      router.replace("/(driver)/home");
    } else {
      router.replace("/(rider)/home");
    }
  }, [isLoading, isAuthenticated, user]);

  return (
    <View className="flex-1 bg-primary-600 items-center justify-center">
      <LoadingSpinner message="Loading..." size="large" />
    </View>
  );
}
