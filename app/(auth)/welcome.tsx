import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../src/components/ui/Button";

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <View className="w-32 h-32 bg-primary-100 rounded-full items-center justify-center mb-8">
          <Text className="text-6xl">🚗</Text>
        </View>

        <Text className="text-3xl font-bold text-gray-900 text-center mb-2">
          {t("auth.welcome")}
        </Text>
        <Text className="text-lg text-gray-500 text-center mb-2">
          {t("common.slogan")}
        </Text>
        <Text className="text-base text-gray-400 text-center mb-12">
          {t("auth.welcomeSubtitle")}
        </Text>
      </View>

      <View className="px-8 pb-8">
        <Button
          title={t("common.continue")}
          onPress={() => router.push("/(auth)/login")}
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}
