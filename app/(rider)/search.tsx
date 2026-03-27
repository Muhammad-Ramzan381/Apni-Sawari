import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocationStore } from "../../src/stores/locationStore";
import LocationInput, {
  PlaceResult,
} from "../../src/components/common/LocationInput";
import Button from "../../src/components/ui/Button";
import { useState } from "react";

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    pickup,
    dropoff,
    setPickup,
    setDropoff,
    currentLocation,
  } = useLocationStore();

  const [pickupText, setPickupText] = useState(
    pickup?.address || t("rider.currentLocation")
  );
  const [dropoffText, setDropoffText] = useState(dropoff?.address || "");
  const [pickupSet, setPickupSet] = useState(!!pickup || !!currentLocation);
  const [dropoffSet, setDropoffSet] = useState(!!dropoff);

  // Auto-set pickup to current location if not set
  if (!pickup && currentLocation) {
    setPickup({
      address: t("rider.currentLocation"),
      lat: currentLocation.lat,
      lng: currentLocation.lng,
    });
  }

  const handlePickupSelect = (place: PlaceResult) => {
    setPickup({ address: place.address, lat: place.lat, lng: place.lng });
    setPickupSet(true);
  };

  const handleDropoffSelect = (place: PlaceResult) => {
    setDropoff({ address: place.address, lat: place.lat, lng: place.lng });
    setDropoffSet(true);
  };

  const handleContinue = () => {
    router.push("/(rider)/select-vehicle");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-4">
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>

        {/* Pickup */}
        <View className="flex-row items-start mb-3">
          <View className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-4" />
          <View className="flex-1">
            <LocationInput
              placeholder={t("rider.pickup")}
              value={pickupText}
              onChangeText={setPickupText}
              onSelectPlace={handlePickupSelect}
              leftIcon={null}
            />
          </View>
        </View>

        {/* Vertical line connector */}
        <View className="ml-1.5 w-px h-4 bg-gray-300 mb-1" />

        {/* Dropoff */}
        <View className="flex-row items-start mb-3">
          <View className="w-3 h-3 bg-red-500 rounded-full mr-3 mt-4" />
          <View className="flex-1">
            <LocationInput
              placeholder={t("rider.dropoff")}
              value={dropoffText}
              onChangeText={setDropoffText}
              onSelectPlace={handleDropoffSelect}
              autoFocus
            />
          </View>
        </View>

        {/* Add Stop */}
        <TouchableOpacity className="flex-row items-center py-3 pl-6">
          <Text className="text-primary-600 text-sm font-medium">
            + {t("rider.addStop")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Spacer */}
      <View className="flex-1" />

      {/* Continue Button */}
      {pickupSet && dropoffSet ? (
        <View className="px-4 pb-4">
          <Button
            title={t("common.continue")}
            onPress={handleContinue}
            size="lg"
            fullWidth
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}
