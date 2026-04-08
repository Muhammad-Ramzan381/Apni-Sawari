import { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Mapbox, { getDirections } from "../../src/services/mapbox";
import { useLocationStore } from "../../src/stores/locationStore";
import { useRideStore } from "../../src/stores/rideStore";
import DriverMarker from "../../src/components/map/DriverMarker";
import RoutePolyline from "../../src/components/map/RoutePolyline";
import RideStatusBar from "../../src/components/ride/RideStatusBar";
import DriverInfoCard from "../../src/components/ride/DriverInfoCard";
import { RideStatus } from "../../src/types/ride";

export default function TrackingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { currentLocation, pickup, dropoff } = useLocationStore();
  const { driverLocation, setDriverLocation, setEta, eta } = useRideStore();
  const cameraRef = useRef<Mapbox.Camera>(null);

  const [rideStatus, setRideStatus] = useState<RideStatus>("accepted");
  const [routeCoords, setRouteCoords] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);

  // Fetch route polyline
  useEffect(() => {
    if (!pickup || !dropoff) return;

    (async () => {
      try {
        const result = await getDirections(
          { lat: pickup.lat, lng: pickup.lng },
          { lat: dropoff.lat, lng: dropoff.lng }
        );
        setRouteCoords(result.coordinates);
      } catch {
        // No API key, create simple straight line
        setRouteCoords([
          { latitude: pickup.lat, longitude: pickup.lng },
          { latitude: dropoff.lat, longitude: dropoff.lng },
        ]);
      }
    })();
  }, [pickup, dropoff]);

  // Simulate driver movement for demo
  useEffect(() => {
    if (!pickup) return;

    let step = 0;
    const startLat = pickup.lat + 0.01;
    const startLng = pickup.lng + 0.008;

    const interval = setInterval(() => {
      step++;
      const progress = Math.min(step / 20, 1);

      const driverLat = startLat + (pickup.lat - startLat) * progress;
      const driverLng = startLng + (pickup.lng - startLng) * progress;

      setDriverLocation({
        lat: driverLat,
        lng: driverLng,
        heading: 180,
      });

      const remainingEta = Math.max(1, Math.round(5 * (1 - progress)));
      setEta(remainingEta);

      // Status progression
      if (step === 15) {
        setRideStatus("arrived");
      } else if (step === 20) {
        setRideStatus("started");
      } else if (step === 35) {
        setRideStatus("completed");
        clearInterval(interval);
        setTimeout(() => router.replace("/(rider)/rating"), 1500);
      }

      // If ride started, simulate moving toward dropoff
      if (step > 20 && dropoff) {
        const tripProgress = (step - 20) / 15;
        const tripLat = pickup.lat + (dropoff.lat - pickup.lat) * tripProgress;
        const tripLng = pickup.lng + (dropoff.lng - pickup.lng) * tripProgress;
        setDriverLocation({
          lat: tripLat,
          lng: tripLng,
          heading: 90,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pickup, dropoff]);

  const statusMessages: Record<RideStatus, string> = {
    searching: t("rider.findingDriver"),
    accepted: t("rider.driverFound"),
    arrived: t("rider.driverArrived"),
    started: t("rider.rideStarted"),
    completed: t("rider.rideCompleted"),
    cancelled: t("rider.rideCancelled"),
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
          ref={cameraRef}
          zoomLevel={13}
          centerCoordinate={
            currentLocation
              ? [currentLocation.lng, currentLocation.lat]
              : [74.35, 31.52]
          }
        />

        <Mapbox.UserLocation visible animated />

        {/* Pickup marker */}
        {pickup && (
          <Mapbox.PointAnnotation
            id="pickup-marker"
            coordinate={[pickup.lng, pickup.lat]}
          >
            <View className="bg-green-500 rounded-full p-1.5">
              <Text className="text-white text-xs font-bold">P</Text>
            </View>
          </Mapbox.PointAnnotation>
        )}

        {/* Dropoff marker */}
        {dropoff && (
          <Mapbox.PointAnnotation
            id="dropoff-marker"
            coordinate={[dropoff.lng, dropoff.lat]}
          >
            <View className="bg-red-500 rounded-full p-1.5">
              <Text className="text-white text-xs font-bold">D</Text>
            </View>
          </Mapbox.PointAnnotation>
        )}

        {/* Driver marker */}
        {driverLocation && (
          <DriverMarker
            location={driverLocation}
            heading={driverLocation.heading}
          />
        )}

        {/* Route polyline */}
        <RoutePolyline coordinates={routeCoords} />
      </Mapbox.MapView>

      {/* Status & Driver Info */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        {/* Status bar */}
        <View className="bg-white rounded-xl p-3 mb-3 shadow-sm">
          <RideStatusBar status={rideStatus} />
          <Text className="text-center text-sm text-primary-600 font-medium mt-2">
            {statusMessages[rideStatus]}
          </Text>
        </View>

        {/* Driver info */}
        <DriverInfoCard
          name="Ahmed Khan"
          vehicle="Toyota Corolla 2020"
          plate="LEA-1234"
          rating={4.8}
          phone="+923001234567"
          eta={eta || undefined}
        />
      </View>
    </View>
  );
}
