import { useEffect, useState, useRef } from "react";
import { View, Text, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Mapbox from "../../src/services/mapbox";
import * as Location from "expo-location";
import { useAuthStore } from "../../src/stores/authStore";
import { useLocationStore } from "../../src/stores/locationStore";
import {
  updateDriverLocation,
  removeDriverLocation,
} from "../../src/services/realtime";
import { getDriverProfile } from "../../src/services/users";
import { VehicleType } from "../../src/types/user";
import Card from "../../src/components/ui/Card";
import LoadingSpinner from "../../src/components/ui/LoadingSpinner";

export default function DriverHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const {
    currentLocation,
    setCurrentLocation,
    setLocationLoading,
    isLocationLoading,
  } = useLocationStore();
  const [isOnline, setIsOnline] = useState(false);
  const [vehicleType, setVehicleType] = useState<VehicleType>("ac_car");
  const [todayStats, setTodayStats] = useState({
    rides: 0,
    earnings: 0,
    rating: 0,
  });
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  // Get initial location and driver profile
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      setLocationLoading(false);

      // Fetch driver profile to get vehicle type
      if (user) {
        try {
          const profile = await getDriverProfile(user.id);
          if (profile?.vehicleType) {
            setVehicleType(profile.vehicleType);
          }
        } catch {}
      }
    })();
  }, []);

  // Broadcast location when online
  useEffect(() => {
    if (!isOnline || !user || !currentLocation) return;

    // Start continuous location tracking
    let mounted = true;

    (async () => {
      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 5000,
        },
        (loc) => {
          if (!mounted) return;

          const geoPoint = {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            heading: loc.coords.heading ?? 0,
            speed: loc.coords.speed ?? 0,
          };

          setCurrentLocation(geoPoint);

          // Broadcast to Firebase RTDB
          updateDriverLocation(
            user.id,
            geoPoint,
            vehicleType,
            true
          ).catch(() => {});
        }
      );
    })();

    return () => {
      mounted = false;
      watchRef.current?.remove();
      // Clean up driver location when effect re-runs or unmounts
      if (user) {
        removeDriverLocation(user.id).catch(() => {});
      }
    };
  }, [isOnline, user, currentLocation, vehicleType]);

  // Clean up when going offline
  const handleToggleOnline = (value: boolean) => {
    setIsOnline(value);

    if (!value && user) {
      removeDriverLocation(user.id).catch(() => {});
      watchRef.current?.remove();
    }
  };

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
      </Mapbox.MapView>

      {/* Online/Offline Toggle */}
      <SafeAreaView className="absolute top-0 left-0 right-0" edges={["top"]}>
        <View className="px-4 pt-2">
          <Card className="shadow-md">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  {isOnline ? t("driver.youreOnline") : t("driver.youreOffline")}
                </Text>
                <Text className="text-sm text-gray-500">
                  {isOnline
                    ? t("driver.waitingForRequests")
                    : t("driver.goOnlineToEarn")}
                </Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={handleToggleOnline}
                trackColor={{ false: "#D1D5DB", true: "#96D1FA" }}
                thumbColor={isOnline ? "#1E96E5" : "#9CA3AF"}
              />
            </View>

            {isOnline ? (
              <View className="mt-3 bg-green-50 rounded-lg px-3 py-2">
                <Text className="text-green-700 text-xs font-medium text-center">
                  📡 {t("driver.locationBroadcasting")}
                </Text>
              </View>
            ) : null}
          </Card>
        </View>
      </SafeAreaView>

      {/* Stats Card */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <Card className="shadow-lg">
          <Text className="text-sm font-medium text-gray-500 mb-3">
            {t("driver.today")}
          </Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-xl font-bold text-gray-900">
                {todayStats.rides}
              </Text>
              <Text className="text-xs text-gray-500">{t("driver.rides")}</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="items-center">
              <Text className="text-xl font-bold text-gray-900">
                {t("common.pkr")} {todayStats.earnings}
              </Text>
              <Text className="text-xs text-gray-500">{t("driver.earned")}</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="items-center">
              <Text className="text-xl font-bold text-gray-900">
                ⭐ {todayStats.rating || "—"}
              </Text>
              <Text className="text-xs text-gray-500">{t("driver.rating")}</Text>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}
