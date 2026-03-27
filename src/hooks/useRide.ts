import { useEffect } from "react";
import { useRideStore } from "../stores/rideStore";
import { subscribeToRide } from "../services/rides";

export function useRide(rideId: string | null) {
  const { activeRide, setActiveRide } = useRideStore();

  useEffect(() => {
    if (!rideId) return;

    const unsubscribe = subscribeToRide(rideId, (ride) => {
      setActiveRide(ride);
    });

    return unsubscribe;
  }, [rideId]);

  return activeRide;
}
