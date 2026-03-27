import { useState } from "react";
import { View, Text, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/stores/authStore";
import { createUser } from "../../src/services/users";
import { UserRole } from "../../src/types/user";
import Card from "../../src/components/ui/Card";
import LoadingSpinner from "../../src/components/ui/LoadingSpinner";

export default function RoleSelectScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { uid, name, email } = useLocalSearchParams<{
    uid: string;
    name: string;
    email: string;
  }>();
  const setUser = useAuthStore((s) => s.setUser);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = async (role: UserRole) => {
    setLoading(true);

    try {
      const userId = uid || `user_${Date.now()}`;
      const userName = name || "";
      const userEmail = email || "";

      let appUser;
      try {
        appUser = await createUser(userId, userEmail, role, userName);
      } catch {
        // If Firestore fails, create local user
        appUser = {
          id: userId,
          displayName: userName,
          phone: "",
          email: userEmail,
          role,
          activeRole: role,
          language: "en" as const,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      }

      setUser(appUser);
      setOnboarded(true);

      if (role === "driver") {
        router.replace("/(driver)/home");
      } else {
        router.replace("/(rider)/home");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Setting up your account..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 pt-16">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {t("auth.selectRole")}
        </Text>
        <Text className="text-base text-gray-500 mb-8">
          You can switch roles anytime in settings
        </Text>

        <Card onPress={() => handleRoleSelect("rider")} className="mb-4">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-primary-100 rounded-2xl items-center justify-center mr-4">
              <Text className="text-3xl">🧑</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {t("auth.asRider")}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {t("auth.asRiderDesc")}
              </Text>
            </View>
            <Text className="text-2xl text-gray-300">›</Text>
          </View>
        </Card>

        <Card onPress={() => handleRoleSelect("driver")}>
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-secondary-100 rounded-2xl items-center justify-center mr-4">
              <Text className="text-3xl">🚗</Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900">
                {t("auth.asDriver")}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {t("auth.asDriverDesc")}
              </Text>
            </View>
            <Text className="text-2xl text-gray-300">›</Text>
          </View>
        </Card>
      </View>
    </SafeAreaView>
  );
}
