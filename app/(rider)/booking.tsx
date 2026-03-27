import { useEffect, useState, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/stores/authStore";
import { useRideStore } from "../../src/stores/rideStore";
import { useLocationStore } from "../../src/stores/locationStore";
import { createRide } from "../../src/services/rides";
import { getNearbyDrivers } from "../../src/services/realtime";
import { calculateFare } from "../../src/utils/fare";
import { haversineDistance } from "../../src/utils/distance";
import Button from "../../src/components/ui/Button";

export default function BookingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { selectedVehicle, paymentMethod, setActiveRide } = useRideStore();
  const { pickup, dropoff, stops } = useLocationStore();
  const [searchTime, setSearchTime] = useState(0);
  const [status, setStatus] = useState<"creating" | "searching" | "found">("creating");
  const [rideId, setRideId] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Create ride and search for drivers
  useEffect(() => {
    if (!user || !pickup || !dropoff || !selectedVehicle) {
      router.back();
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        // Calculate fare
        const distance = haversineDistance(
          { lat: pickup.lat, lng: pickup.lng },
          { lat: dropoff.lat, lng: dropoff.lng }
        );
        const duration = distance * 3; // rough estimate
        const fare = calculateFare(selectedVehicle, distance, duration);

        // Create ride in Firestore
        let createdRideId: string;
        try {
          createdRideId = await createRide({
            riderId: user.id,
            pickup,
            dropoff,
            stops,
            vehicleType: selectedVehicle,
            fare,
            estimatedDistance: distance,
            estimatedDuration: duration,
            isSurge: false,
            surgeMultiplier: 1,
            paymentMethod,
            isCourier: selectedVehicle === "courier",
          });
        } catch {
          // Firestore not configured, use mock ID
          createdRideId = `ride_${Date.now()}`;
        }

        if (cancelled) return;
        setRideId(createdRideId);
        setStatus("searching");

        // Search for nearby drivers
        const drivers = await getNearbyDrivers(
          { lat: pickup.lat, lng: pickup.lng },
          10, // 10km radius
          selectedVehicle
        ).catch(() => []);

        // Simulate finding a driver after a delay
        setTimeout(() => {
          if (!cancelled) {
            setStatus("found");
            setTimeout(() => {
              if (!cancelled) {
                router.replace("/(rider)/tracking");
              }
            }, 1500);
          }
        }, 4000);
      } catch {
        if (!cancelled) router.back();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Search timer
  useEffect(() => {
    if (status !== "searching") return;
    const timer = setInterval(() => setSearchTime((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      <View className="items-center px-8">
        <Animated.View
          style={{ transform: [{ scale: pulseAnim }] }}
          className="w-24 h-24 bg-primary-100 rounded-full items-center justify-center mb-6"
        >
          <Text className="text-5xl">
            {status === "found" ? "✅" : "🔍"}
          </Text>
        </Animated.View>

        <Text className="text-xl font-bold text-gray-900 mb-2">
          {status === "creating"
            ? "Creating your ride..."
            : status === "found"
              ? t("rider.driverFound")
              : t("rider.findingDriver")}
        </Text>

        {status === "searching" ? (
          <Text className="text-base text-gray-500 mb-6">
            Searching for {searchTime}s...
          </Text>
        ) : null}

        {status === "found" ? (
          <Text className="text-base text-primary-600 font-medium mb-6">
            Connecting you with your driver...
          </Text>
        ) : null}

        {/* Ride summary */}
        <View className="bg-gray-50 rounded-xl p-4 w-full mb-8">
          <View className="flex-row items-center mb-2">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <Text className="text-sm text-gray-600 flex-1" numberOfLines={1}>
              {pickup?.address}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
            <Text className="text-sm text-gray-600 flex-1" numberOfLines={1}>
              {dropoff?.address}
            </Text>
          </View>
        </View>

        <Button
          title={t("common.cancel")}
          onPress={() => router.back()}
          variant="outline"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}
