import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRideStore } from "../../src/stores/rideStore";
import { useLocationStore } from "../../src/stores/locationStore";
import { VEHICLE_CONFIGS } from "../../src/types/vehicle";
import { VehicleType } from "../../src/types/user";
import { calculateFare, formatFare } from "../../src/utils/fare";
import { haversineDistance, formatDuration } from "../../src/utils/distance";
import { getActiveSurgeZones, isPointInSurgeZone, SurgeZone } from "../../src/services/surge";
import VehicleCard from "../../src/components/ride/VehicleCard";
import FareEstimate from "../../src/components/ride/FareEstimate";
import Button from "../../src/components/ui/Button";
import Modal from "../../src/components/ui/Modal";

const vehicleList = Object.values(VEHICLE_CONFIGS);

export default function SelectVehicleScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedVehicle, setSelectedVehicle, paymentMethod, setPaymentMethod } =
    useRideStore();
  const { pickup, dropoff } = useLocationStore();
  const [surgeZones, setSurgeZones] = useState<SurgeZone[]>([]);
  const [showFareBreakdown, setShowFareBreakdown] = useState(false);

  const estimatedDistance =
    pickup && dropoff
      ? haversineDistance(
          { lat: pickup.lat, lng: pickup.lng },
          { lat: dropoff.lat, lng: dropoff.lng }
        )
      : 5;
  const estimatedDuration = estimatedDistance * 3;

  // Check surge pricing at pickup
  const surgeInfo = pickup
    ? isPointInSurgeZone({ lat: pickup.lat, lng: pickup.lng }, surgeZones)
    : { inSurge: false, multiplier: 1 };

  useEffect(() => {
    getActiveSurgeZones().then(setSurgeZones).catch(() => {});
  }, []);

  const handleBookRide = () => {
    if (!selectedVehicle) return;
    router.push("/(rider)/booking");
  };

  const selectedFare = selectedVehicle
    ? calculateFare(selectedVehicle, estimatedDistance, estimatedDuration, surgeInfo.multiplier)
    : null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 pt-4 pb-2 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mb-3">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">
          {t("rider.selectVehicle")}
        </Text>
        <View className="flex-row items-center mt-1">
          <View className="w-2 h-2 bg-green-500 rounded-full mr-1.5" />
          <Text className="text-xs text-gray-500 flex-1" numberOfLines={1}>
            {pickup?.address}
          </Text>
          <Text className="text-xs text-gray-400 mx-1">→</Text>
          <View className="w-2 h-2 bg-red-500 rounded-full mr-1.5" />
          <Text className="text-xs text-gray-500 flex-1" numberOfLines={1}>
            {dropoff?.address}
          </Text>
        </View>

        {surgeInfo.inSurge ? (
          <View className="bg-orange-50 rounded-lg px-3 py-2 mt-2 flex-row items-center">
            <Text className="text-sm mr-2">⚡</Text>
            <Text className="text-xs text-orange-700 font-medium">
              Surge pricing active ({surgeInfo.multiplier}x) — Higher demand in
              this area
            </Text>
          </View>
        ) : null}
      </View>

      {/* Vehicle List */}
      <FlatList
        data={vehicleList}
        keyExtractor={(item) => item.type}
        className="px-4 pt-4"
        renderItem={({ item }) => {
          const fare = calculateFare(
            item.type,
            estimatedDistance,
            estimatedDuration,
            surgeInfo.multiplier
          );

          return (
            <VehicleCard
              config={item}
              fare={fare.total}
              duration={estimatedDuration}
              isSelected={selectedVehicle === item.type}
              isSurge={surgeInfo.inSurge}
              surgeMultiplier={surgeInfo.multiplier}
              onPress={() => setSelectedVehicle(item.type)}
            />
          );
        }}
      />

      {/* Bottom: Payment + Book */}
      <View className="px-4 pb-4 bg-white pt-4 border-t border-gray-100">
        <View className="flex-row mb-4">
          {(["cash", "jazzcash", "easypaisa"] as const).map((method) => (
            <TouchableOpacity
              key={method}
              onPress={() => setPaymentMethod(method)}
              className={`flex-1 py-2.5 mx-1 rounded-lg items-center border ${
                paymentMethod === method
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  paymentMethod === method ? "text-primary-600" : "text-gray-600"
                }`}
              >
                {t(`rider.${method}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedFare ? (
          <TouchableOpacity
            onPress={() => setShowFareBreakdown(true)}
            className="mb-3"
          >
            <Text className="text-center text-primary-600 text-sm underline">
              {t("rider.estimatedFare")}: {formatFare(selectedFare.total)} — View
              breakdown
            </Text>
          </TouchableOpacity>
        ) : null}

        <Button
          title={t("rider.bookRide")}
          onPress={handleBookRide}
          disabled={!selectedVehicle}
          size="lg"
          fullWidth
        />
      </View>

      {/* Fare Breakdown Modal */}
      {selectedFare ? (
        <Modal
          visible={showFareBreakdown}
          onClose={() => setShowFareBreakdown(false)}
          title="Fare Breakdown"
        >
          <FareEstimate
            fare={selectedFare}
            isSurge={surgeInfo.inSurge}
            surgeMultiplier={surgeInfo.multiplier}
          />
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}
