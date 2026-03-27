import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/stores/authStore";
import { getDriverHistory } from "../../src/services/rides";
import { formatFare } from "../../src/utils/fare";
import { Ride } from "../../src/types/ride";
import { VEHICLE_CONFIGS } from "../../src/types/vehicle";
import { COMMISSION_RATE } from "../../src/types/wallet";
import Card from "../../src/components/ui/Card";
import LoadingSpinner from "../../src/components/ui/LoadingSpinner";

type Period = "today" | "week" | "month";

export default function EarningsScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [period, setPeriod] = useState<Period>("today");
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const history = await getDriverHistory(user.id, 50);
        setRides(history);
      } catch {
        // Firestore not configured
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  // Filter rides by period
  const now = Date.now();
  const periodMs = {
    today: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
  };

  const filteredRides = rides.filter(
    (r) => r.status === "completed" && now - r.createdAt < periodMs[period]
  );

  const totalEarnings = filteredRides.reduce(
    (sum, r) => sum + (r.fare?.total || 0),
    0
  );
  const totalCommission = Math.round(totalEarnings * COMMISSION_RATE);
  const netEarnings = totalEarnings - totalCommission;

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          {t("driver.earnings")}
        </Text>

        {/* Period Selector */}
        <View className="flex-row mb-4">
          {(["today", "week", "month"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              className={`flex-1 py-2.5 mx-1 rounded-lg items-center ${
                period === p
                  ? "bg-primary-600"
                  : "bg-white border border-gray-200"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  period === p ? "text-white" : "text-gray-600"
                }`}
              >
                {p === "today"
                  ? t("driver.today")
                  : p === "week"
                    ? t("driver.thisWeek")
                    : t("driver.thisMonth")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Earnings Summary */}
        <Card className="mb-4 bg-primary-600">
          <Text className="text-primary-200 text-sm">Net Earnings</Text>
          <Text className="text-white text-3xl font-bold">
            {formatFare(netEarnings)}
          </Text>
        </Card>

        {/* Stats Grid */}
        <View className="flex-row mb-4">
          <Card className="flex-1 mr-2">
            <Text className="text-gray-500 text-xs">
              {t("driver.ridesCompleted")}
            </Text>
            <Text className="text-xl font-bold text-gray-900">
              {filteredRides.length}
            </Text>
          </Card>
          <Card className="flex-1 mx-1">
            <Text className="text-gray-500 text-xs">Gross</Text>
            <Text className="text-xl font-bold text-green-600">
              {formatFare(totalEarnings)}
            </Text>
          </Card>
          <Card className="flex-1 ml-2">
            <Text className="text-gray-500 text-xs">
              {t("driver.commission")}
            </Text>
            <Text className="text-xl font-bold text-red-500">
              -{formatFare(totalCommission)}
            </Text>
          </Card>
        </View>

        <Text className="text-base font-bold text-gray-900 mb-2">
          Completed Rides
        </Text>
      </View>

      {filteredRides.length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-gray-400">No rides in this period</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRides}
          keyExtractor={(item) => item.id}
          className="px-4"
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const config = VEHICLE_CONFIGS[item.vehicleType];
            return (
              <Card className="mb-2">
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">{config?.icon || "🚗"}</Text>
                  <View className="flex-1">
                    <Text className="text-sm text-gray-600" numberOfLines={1}>
                      {item.pickup?.address} → {item.dropoff?.address}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
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
