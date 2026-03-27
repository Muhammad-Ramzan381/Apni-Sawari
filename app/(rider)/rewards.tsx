import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../src/components/ui/Card";
import { REWARD_MILESTONES } from "../../src/types/wallet";

export default function RewardsScreen() {
  const { t } = useTranslation();
  const totalSpent = 0; // TODO: Fetch from Firestore

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          {t("rider.rewards")}
        </Text>

        <Card className="mb-6">
          <Text className="text-sm text-gray-500 mb-1">Total Spent</Text>
          <Text className="text-2xl font-bold text-gray-900">
            PKR {totalSpent.toLocaleString()}
          </Text>
        </Card>

        <Text className="text-lg font-bold text-gray-900 mb-3">
          Milestones
        </Text>
        {REWARD_MILESTONES.map((milestone) => {
          const achieved = totalSpent >= milestone.spent;
          return (
            <Card
              key={milestone.spent}
              className={`mb-3 ${achieved ? "border-green-500 border" : ""}`}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-base font-medium text-gray-900">
                    Spend PKR {milestone.spent.toLocaleString()}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Get PKR {milestone.bonus} bonus
                  </Text>
                </View>
                <Text className="text-2xl">
                  {achieved ? "✅" : "🔒"}
                </Text>
              </View>
            </Card>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
