import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRideStore } from "../../src/stores/rideStore";
import { useLocationStore } from "../../src/stores/locationStore";
import { rateRide } from "../../src/services/rides";
import { formatFare } from "../../src/utils/fare";
import Button from "../../src/components/ui/Button";
import Card from "../../src/components/ui/Card";

export default function RatingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { activeRide, resetRide } = useRideStore();
  const { resetLocations } = useLocationStore();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const fare = activeRide?.fare?.total || 350; // fallback for demo

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (activeRide?.id) {
        await rateRide(activeRide.id, "rider", rating).catch(() => {});
      }
    } finally {
      resetRide();
      resetLocations();
      setLoading(false);
      router.replace("/(rider)/home");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-5xl mb-4">🎉</Text>
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {t("rider.rideCompleted")}
        </Text>

        <Card className="w-full mt-6">
          <Text className="text-center text-gray-500 mb-1">
            {t("rider.totalFare")}
          </Text>
          <Text className="text-3xl font-bold text-gray-900 text-center">
            {formatFare(fare)}
          </Text>
          {activeRide?.paymentMethod ? (
            <Text className="text-center text-gray-400 text-sm mt-1">
              Paid via {activeRide.paymentMethod}
            </Text>
          ) : null}
        </Card>

        <Text className="text-base text-gray-600 mt-8 mb-4">
          {t("rider.rateExperience")}
        </Text>

        <View className="flex-row mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              className="mx-2"
            >
              <Text className="text-4xl">
                {star <= rating ? "⭐" : "☆"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 ? (
          <Text className="text-sm text-gray-400">
            {rating <= 2
              ? "We're sorry about your experience"
              : rating <= 4
                ? "Thanks for your feedback!"
                : "Glad you had a great ride!"}
          </Text>
        ) : null}
      </View>

      <View className="px-8 pb-8">
        <Button
          title={t("rider.submitRating")}
          onPress={handleSubmit}
          loading={loading}
          disabled={rating === 0}
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}
