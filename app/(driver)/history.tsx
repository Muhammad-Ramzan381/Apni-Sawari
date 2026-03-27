import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriverHistoryScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Trip History
        </Text>
        <View className="flex-1 items-center justify-center py-16">
          <Text className="text-5xl mb-4">📋</Text>
          <Text className="text-base text-gray-500">No trips yet</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
