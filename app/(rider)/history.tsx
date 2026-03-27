import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/stores/authStore";
import { getRiderHistory } from "../../src/services/rides";
import { formatFare } from "../../src/utils/fare";
import { formatDistance, formatDuration } from "../../src/utils/distance";
import { Ride } from "../../src/types/ride";
import { VEHICLE_CONFIGS } from "../../src/types/vehicle";
import Card from "../../src/components/ui/Card";
import Badge from "../../src/components/ui/Badge";
import LoadingSpinner from "../../src/components/ui/LoadingSpinner";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        const history = await getRiderHistory(user.id);
        setRides(history);
      } catch {
        // Firestore not configured
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading rides..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">
          {t("rider.rideHistory")}
        </Text>
      </View>

      {rides.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-4">🚗</Text>
          <Text className="text-base text-gray-500">{t("rider.noRides")}</Text>
          <Text className="text-sm text-gray-400 mt-1">
            Your completed rides will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          className="px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const config = VEHICLE_CONFIGS[item.vehicleType];
            const date = new Date(item.createdAt);

            return (
              <Card className="mb-3">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center">
                    <Text className="text-xl mr-2">{config?.icon || "🚗"}</Text>
                    <Text className="text-sm font-medium text-gray-900">
                      {config?.nameEn || item.vehicleType}
                    </Text>
                  </View>
                  <Badge
                    text={item.status === "completed" ? "Completed" : "Cancelled"}
                    variant={item.status === "completed" ? "success" : "danger"}
                  />
                </View>

                <View className="mb-2">
                  <View className="flex-row items-center mb-1">
                    <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <Text className="text-sm text-gray-600" numberOfLines={1}>
                      {item.pickup?.address}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                    <Text className="text-sm text-gray-600" numberOfLines={1}>
                      {item.dropoff?.address}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
                  <Text className="text-xs text-gray-400">
                    {date.toLocaleDateString()} • {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                  <Text className="text-base font-bold text-gray-900">
                    {formatFare(item.fare?.total || 0)}
                  </Text>
                </View>
              </Card>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
