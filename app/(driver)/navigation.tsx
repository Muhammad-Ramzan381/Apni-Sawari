import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Mapbox, { getDirections } from "../../src/services/mapbox";
import { useLocationStore } from "../../src/stores/locationStore";
import { useAuthStore } from "../../src/stores/authStore";
import { updateDriverLocation } from "../../src/services/realtime";
import RoutePolyline from "../../src/components/map/RoutePolyline";
import Card from "../../src/components/ui/Card";
import Button from "../../src/components/ui/Button";

type DriverRideStatus = "navigating" | "arrived" | "in_progress";

export default function DriverNavigationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { currentLocation } = useLocationStore();
  const [status, setStatus] = useState<DriverRideStatus>("navigating");
  const [routeCoords, setRouteCoords] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);

  // Mock pickup/dropoff (in production, comes from ride data)
  const pickupLocation = { lat: 31.52, lng: 74.35 };
  const dropoffLocation = { lat: 31.48, lng: 74.32 };

  // Fetch route
  useEffect(() => {
    if (!currentLocation) return;

    const target =
      status === "in_progress" ? dropoffLocation : pickupLocation;

    (async () => {
      try {
        const result = await getDirections(
          { lat: currentLocation.lat, lng: currentLocation.lng },
          target
        );
        setRouteCoords(result.coordinates);
      } catch {
        setRouteCoords([
          {
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
          },
          { latitude: target.lat, longitude: target.lng },
        ]);
      }
    })();
  }, [currentLocation, status]);

  const handleAction = () => {
    switch (status) {
      case "navigating":
        setStatus("arrived");
        break;
      case "arrived":
        setStatus("in_progress");
        break;
      case "in_progress":
        if (user) {
          updateDriverLocation(
            user.id,
            currentLocation!,
            "ac_car",
            true
          ).catch(() => {});
        }
        router.replace("/(driver)/home");
        break;
    }
  };

  const actionLabel = {
    navigating: t("driver.arrived"),
    arrived: t("driver.startRide"),
    in_progress: t("driver.completeRide"),
  };

  const statusLabel = {
    navigating: "Navigating to pickup...",
    arrived: "Waiting for rider",
    in_progress: "Ride in progress",
  };

  const statusIcon = {
    navigating: "📍",
    arrived: "⏳",
    in_progress: "🚗",
  };

  return (
    <View className="flex-1">
      <Mapbox.MapView
        style={{ flex: 1 }}
        styleURL={Mapbox.StyleURL.Street}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <Mapbox.Camera
          zoomLevel={13}
          centerCoordinate={
            currentLocation
              ? [currentLocation.lng, currentLocation.lat]
              : [74.35, 31.52]
          }
        />

        <Mapbox.UserLocation visible animated />

        {/* Pickup marker */}
        <Mapbox.PointAnnotation
          id="pickup-nav"
          coordinate={[pickupLocation.lng, pickupLocation.lat]}
        >
          <View className="bg-green-500 rounded-full p-1.5">
            <Text className="text-white text-xs font-bold">P</Text>
          </View>
        </Mapbox.PointAnnotation>

        {/* Dropoff marker */}
        <Mapbox.PointAnnotation
          id="dropoff-nav"
          coordinate={[dropoffLocation.lng, dropoffLocation.lat]}
        >
          <View className="bg-red-500 rounded-full p-1.5">
            <Text className="text-white text-xs font-bold">D</Text>
          </View>
        </Mapbox.PointAnnotation>

        <RoutePolyline coordinates={routeCoords} />
      </Mapbox.MapView>

      <View className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <Card className="shadow-lg">
          <View className="flex-row items-center mb-3">
            <Text className="text-2xl mr-2">{statusIcon[status]}</Text>
            <Text className="text-primary-600 font-semibold flex-1">
              {statusLabel[status]}
            </Text>
          </View>

          <View className="flex-row items-center mb-4 bg-gray-50 rounded-lg p-3">
            <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center mr-3">
              <Text className="text-xl">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">
                Rider Name
              </Text>
              <Text className="text-sm text-gray-500">
                {status === "in_progress"
                  ? "📍 Heading to drop-off"
                  : "📍 Model Town, Lahore"}
              </Text>
            </View>
            <Text className="text-lg font-bold text-gray-900">PKR 250</Text>
          </View>

          <Button
            title={actionLabel[status]}
            onPress={handleAction}
            variant="primary"
            size="lg"
            fullWidth
          />
        </Card>
      </View>
    </View>
  );
}
