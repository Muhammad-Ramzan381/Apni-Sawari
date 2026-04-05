import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Mapbox from "../../src/services/mapbox";
import { useLocation } from "../../src/hooks/useLocation";
import { useLocationStore } from "../../src/stores/locationStore";
import { getNearbyDrivers } from "../../src/services/realtime";
import { getActiveSurgeZones, SurgeZone } from "../../src/services/surge";
import { GeoPoint, VehicleType } from "../../src/types/user";
import DriverMarker from "../../src/components/map/DriverMarker";
import SurgeZoneCircle from "../../src/components/map/SurgeZone";
import LanguageToggle from "../../src/components/common/LanguageToggle";
import Card from "../../src/components/ui/Card";
import LoadingSpinner from "../../src/components/ui/LoadingSpinner";

export default function RiderHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const currentLocation = useLocation(false);
  const { isLocationLoading } = useLocationStore();
  const [nearbyDrivers, setNearbyDrivers] = useState<
    Array<{ id: string; location: GeoPoint; vehicleType: VehicleType }>
  >([]);
  const [surgeZones, setSurgeZones] = useState<SurgeZone[]>([]);

  // Fetch nearby drivers and surge zones
  useEffect(() => {
    if (!currentLocation) return;

    const fetchData = async () => {
      const [drivers, zones] = await Promise.all([
        getNearbyDrivers(currentLocation, 5).catch(() => []),
        getActiveSurgeZones().catch(() => []),
      ]);
      setNearbyDrivers(drivers);
      setSurgeZones(zones);
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [currentLocation]);

  if (isLocationLoading) {
    return <LoadingSpinner fullScreen message={t("rider.gettingLocation")} />;
  }

  return (
    <View className="flex-1">
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL={Mapbox.StyleURL.Street}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <Mapbox.Camera
          zoomLevel={14}
          centerCoordinate={
            currentLocation
              ? [currentLocation.lng, currentLocation.lat]
              : [74.35, 31.52]
          }
        />

        <Mapbox.UserLocation visible animated />

        {/* Nearby driver markers */}
        {nearbyDrivers.map((driver) => (
          <DriverMarker
            key={driver.id}
            location={driver.location}
            heading={driver.location.heading}
            vehicleIcon={
              driver.vehicleType === "bike"
                ? "🏍️"
                : driver.vehicleType === "rickshaw"
                  ? "🛺"
                  : "🚗"
            }
          />
        ))}

        {/* Surge zones */}
        {surgeZones.map((zone) => (
          <SurgeZoneCircle
            key={zone.id}
            center={zone.center}
            radiusMeters={zone.radius}
            multiplier={zone.multiplier}
          />
        ))}
      </Mapbox.MapView>

      {/* Top bar: Language toggle */}
      <SafeAreaView className="absolute top-0 right-0" edges={["top"]}>
        <View className="pr-4 pt-2">
          <LanguageToggle compact />
        </View>
      </SafeAreaView>

      {/* Where to? Search Bar */}
      <SafeAreaView className="absolute top-0 left-0 right-16" edges={["top"]}>
        <View className="px-4 pt-2">
          <Card
            onPress={() => router.push("/(rider)/search")}
            className="shadow-md"
          >
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-primary-600 rounded-full mr-3" />
              <Text className="text-base text-gray-400 flex-1">
                {t("rider.whereTo")}
              </Text>
              <Text className="text-lg">🔍</Text>
            </View>
          </Card>
        </View>
      </SafeAreaView>

      {/* Bottom Quick Actions */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <Card className="shadow-lg">
          <View className="flex-row justify-around">
            {[
              { icon: "🏍️", label: t("vehicles.bike"), type: "bike" },
              { icon: "🛺", label: t("vehicles.rickshaw"), type: "rickshaw" },
              { icon: "🚗", label: t("vehicles.eco_car"), type: "car" },
              { icon: "📦", label: t("vehicles.courier"), type: "courier" },
            ].map((item) => (
              <TouchableOpacity
                key={item.type}
                className="items-center py-2 px-3"
                onPress={() => router.push("/(rider)/search")}
              >
                <Text className="text-2xl mb-1">{item.icon}</Text>
                <Text className="text-xs text-gray-600 font-medium">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {nearbyDrivers.length > 0 ? (
            <Text className="text-center text-xs text-gray-400 mt-2">
              {t("rider.driversNearby", { count: nearbyDrivers.length })}
            </Text>
          ) : null}
        </Card>
      </View>
    </View>
  );
}
