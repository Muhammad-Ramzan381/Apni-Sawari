import { useEffect, useState, useRef } from "react";
import { View, Text, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useAuthStore } from "../../src/stores/authStore";
import { useLocationStore } from "../../src/stores/locationStore";
import {
  updateDriverLocation,
  removeDriverLocation,
} from "../../src/services/realtime";
import { DEFAULT_MAP_DELTA } from "../../src/utils/constants";
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
  const [todayStats, setTodayStats] = useState({
    rides: 0,
    earnings: 0,
    rating: 0,
  });
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  // Get initial location
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
            "ac_car", // TODO: get from driver profile
            true
          ).catch(() => {});
        }
      );
    })();

    return () => {
      mounted = false;
      watchRef.current?.remove();
    };
  }, [isOnline, user]);

  // Clean up when going offline
  const handleToggleOnline = (value: boolean) => {
    setIsOnline(value);

    if (!value && user) {
      removeDriverLocation(user.id).catch(() => {});
      watchRef.current?.remove();
    }
  };

  if (isLocationLoading) {
    return <LoadingSpinner fullScreen message="Getting your location..." />;
  }

  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        showsMyLocationButton
        initialRegion={
          currentLocation
            ? {
                latitude: currentLocation.lat,
                longitude: currentLocation.lng,
                ...DEFAULT_MAP_DELTA,
              }
            : undefined
        }
      />

      {/* Online/Offline Toggle */}
      <SafeAreaView className="absolute top-0 left-0 right-0" edges={["top"]}>
        <View className="px-4 pt-2">
          <Card className="shadow-md">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">
                  {isOnline ? "You're Online" : "You're Offline"}
                </Text>
                <Text className="text-sm text-gray-500">
                  {isOnline
                    ? "Waiting for ride requests..."
                    : t("driver.goOnline") + " to start earning"}
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
                  📡 Location broadcasting active
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
              <Text className="text-xs text-gray-500">Rides</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="items-center">
              <Text className="text-xl font-bold text-gray-900">
                PKR {todayStats.earnings}
              </Text>
              <Text className="text-xs text-gray-500">Earned</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="items-center">
              <Text className="text-xl font-bold text-gray-900">
                ⭐ {todayStats.rating || "—"}
              </Text>
              <Text className="text-xs text-gray-500">Rating</Text>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}
