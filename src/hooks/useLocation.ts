import { useEffect, useRef } from "react";
import * as Location from "expo-location";
import { useLocationStore } from "../stores/locationStore";

export function useLocation(trackContinuously: boolean = false) {
  const { currentLocation, setCurrentLocation, setLocationLoading } =
    useLocationStore();
  const watchRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      if (mounted) {
        setCurrentLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          heading: location.coords.heading ?? undefined,
          speed: location.coords.speed ?? undefined,
        });
        setLocationLoading(false);
      }

      if (trackContinuously) {
        watchRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 10, // update every 10 meters
            timeInterval: 5000, // or every 5 seconds
          },
          (loc) => {
            if (mounted) {
              setCurrentLocation({
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
                heading: loc.coords.heading ?? undefined,
                speed: loc.coords.speed ?? undefined,
              });
            }
          }
        );
      }
    })();

    return () => {
      mounted = false;
      watchRef.current?.remove();
    };
  }, [trackContinuously]);

  return currentLocation;
}
