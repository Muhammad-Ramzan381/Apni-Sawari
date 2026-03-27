import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/stores/authStore";
import { useSettingsStore } from "../../src/stores/settingsStore";
import Card from "../../src/components/ui/Card";

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, switchRole, logout } = useAuthStore();
  const { language, setLanguage } = useSettingsStore();

  const handleSwitchRole = () => {
    const newRole = user?.activeRole === "rider" ? "driver" : "rider";
    switchRole(newRole);
    if (newRole === "driver") {
      router.replace("/(driver)/home");
    } else {
      router.replace("/(rider)/home");
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/welcome");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          {t("rider.profile")}
        </Text>

        {/* User Info */}
        <Card className="mb-4">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center mr-4">
              <Text className="text-3xl">👤</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">
                {user?.displayName || "User"}
              </Text>
              <Text className="text-sm text-gray-500">
                {user?.phone || "+92 XXX XXXXXXX"}
              </Text>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Card className="mb-4">
          {/* Language Toggle */}
          <TouchableOpacity
            onPress={() => setLanguage(language === "en" ? "ur" : "en")}
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
          >
            <Text className="text-base text-gray-900">
              {t("settings.language")}
            </Text>
            <Text className="text-sm text-primary-600 font-medium">
              {language === "en" ? t("settings.urdu") : t("settings.english")}
            </Text>
          </TouchableOpacity>

          {/* Switch Role */}
          <TouchableOpacity
            onPress={handleSwitchRole}
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
          >
            <Text className="text-base text-gray-900">
              {t("settings.switchRole", {
                role: user?.activeRole === "rider" ? "Driver" : "Rider",
              })}
            </Text>
            <Text className="text-lg">🔄</Text>
          </TouchableOpacity>

          {/* Rewards */}
          <TouchableOpacity
            onPress={() => router.push("/(rider)/rewards")}
            className="flex-row items-center justify-between py-3"
          >
            <Text className="text-base text-gray-900">
              {t("rider.rewards")}
            </Text>
            <Text className="text-lg">🎁</Text>
          </TouchableOpacity>
        </Card>

        {/* Logout */}
        <Card>
          <TouchableOpacity onPress={handleLogout} className="py-2">
            <Text className="text-base text-danger font-medium text-center">
              {t("settings.logout")}
            </Text>
          </TouchableOpacity>
        </Card>
      </View>
    </SafeAreaView>
  );
}
