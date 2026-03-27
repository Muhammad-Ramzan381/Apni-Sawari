import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { SKIP_RESPONSE_TIME } from "../../src/utils/constants";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";

export default function RideRequestScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(SKIP_RESPONSE_TIME);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.back(); // Auto-decline
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      <View className="px-8 w-full">
        <Text className="text-center text-5xl mb-4">🚗</Text>
        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
          {t("driver.newRideRequest")}
        </Text>

        {/* Timer */}
        <View className="w-20 h-20 rounded-full border-4 border-primary-600 items-center justify-center self-center my-6">
          <Text className="text-2xl font-bold text-primary-600">
            {timeLeft}
          </Text>
        </View>

        <Card className="mb-6">
          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">PICKUP</Text>
            <Text className="text-base text-gray-900">📍 Model Town, Lahore</Text>
          </View>
          <View className="mb-3">
            <Text className="text-xs text-gray-500 mb-1">DROP-OFF</Text>
            <Text className="text-base text-gray-900">📍 Packages Mall, Lahore</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">Distance: 5.2 km</Text>
            <Text className="text-sm font-bold text-gray-900">PKR 250</Text>
          </View>
        </Card>

        <View className="flex-row">
          <View className="flex-1 mr-2">
            <Button
              title={t("driver.decline")}
              onPress={() => router.back()}
              variant="outline"
              fullWidth
            />
          </View>
          <View className="flex-1 ml-2">
            <Button
              title={t("driver.accept")}
              onPress={() => router.replace("/(driver)/navigation")}
              fullWidth
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
