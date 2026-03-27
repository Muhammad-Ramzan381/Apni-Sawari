import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/stores/authStore";
import { useSettingsStore } from "../../src/stores/settingsStore";
import Card from "../../src/components/ui/Card";

export default function DriverProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, switchRole, logout } = useAuthStore();
  const { language, setLanguage } = useSettingsStore();

  const handleSwitchRole = () => {
    switchRole("rider");
    router.replace("/(rider)/home");
  };

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/welcome");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">
          Profile
        </Text>

        <Card className="mb-4">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-secondary-100 rounded-full items-center justify-center mr-4">
              <Text className="text-3xl">🚗</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">
                {user?.displayName || "Driver"}
              </Text>
              <Text className="text-sm text-gray-500">
                {user?.phone || "+92 XXX XXXXXXX"}
              </Text>
            </View>
          </View>
        </Card>

        <Card className="mb-4">
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

          <TouchableOpacity
            onPress={handleSwitchRole}
            className="flex-row items-center justify-between py-3 border-b border-gray-100"
          >
            <Text className="text-base text-gray-900">
              {t("settings.switchRole", { role: "Rider" })}
            </Text>
            <Text className="text-lg">🔄</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(driver)/wallet")}
            className="flex-row items-center justify-between py-3"
          >
            <Text className="text-base text-gray-900">
              {t("driver.wallet")}
            </Text>
            <Text className="text-lg">💰</Text>
          </TouchableOpacity>
        </Card>

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
