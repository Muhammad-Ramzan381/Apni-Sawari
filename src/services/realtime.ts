import {
  ref,
  set,
  onValue,
  off,
  query,
  orderByChild,
  equalTo,
  get,
  update,
  serverTimestamp,
} from "firebase/database";
import { rtdb } from "./firebase";
import { GeoPoint, VehicleType } from "../types/user";

// ============ DRIVER LOCATION ============

interface DriverLocationData {
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  vehicleType: VehicleType;
  isAvailable: boolean;
  updatedAt: object;
}

export function updateDriverLocation(
  driverId: string,
  location: GeoPoint,
  vehicleType: VehicleType,
  isAvailable: boolean
): Promise<void> {
  const locationRef = ref(rtdb, `driver_locations/${driverId}`);
  return set(locationRef, {
    lat: location.lat,
    lng: location.lng,
    heading: location.heading || 0,
    speed: location.speed || 0,
    vehicleType,
    isAvailable,
    updatedAt: serverTimestamp(),
  });
}

export function removeDriverLocation(driverId: string): Promise<void> {
  return set(ref(rtdb, `driver_locations/${driverId}`), null);
}

export function subscribeToDriverLocation(
  driverId: string,
  callback: (location: GeoPoint | null) => void
): () => void {
  const locationRef = ref(rtdb, `driver_locations/${driverId}`);

  const listener = onValue(locationRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback({
        lat: data.lat,
        lng: data.lng,
        heading: data.heading,
        speed: data.speed,
      });
    } else {
      callback(null);
    }
  });

  return () => off(locationRef);
}

export async function getNearbyDrivers(
  center: GeoPoint,
  radiusKm: number,
  vehicleType?: VehicleType
): Promise<Array<{ id: string; location: GeoPoint; vehicleType: VehicleType }>> {
  const driversRef = ref(rtdb, "driver_locations");
  const snapshot = await get(driversRef);

  if (!snapshot.exists()) return [];

  const drivers: Array<{
    id: string;
    location: GeoPoint;
    vehicleType: VehicleType;
  }> = [];

  snapshot.forEach((child) => {
    const data = child.val();
    if (!data.isAvailable) return;
    if (vehicleType && data.vehicleType !== vehicleType) return;

    // Simple distance check (rough bounding box)
    const latDiff = Math.abs(data.lat - center.lat);
    const lngDiff = Math.abs(data.lng - center.lng);
    const approxKm = Math.sqrt(latDiff ** 2 + lngDiff ** 2) * 111;

    if (approxKm <= radiusKm) {
      drivers.push({
        id: child.key!,
        location: {
          lat: data.lat,
          lng: data.lng,
          heading: data.heading,
          speed: data.speed,
        },
        vehicleType: data.vehicleType,
      });
    }
  });

  return drivers;
}

// ============ ACTIVE RIDE TRACKING ============

interface ActiveRideData {
  status: string;
  driverLocation: { lat: number; lng: number } | null;
  eta: number | null;
  updatedAt: object;
}

export function updateActiveRide(
  rideId: string,
  data: Partial<ActiveRideData>
): Promise<void> {
  const rideRef = ref(rtdb, `active_rides/${rideId}`);
  return update(rideRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToActiveRide(
  rideId: string,
  callback: (data: {
    status: string;
    driverLocation: GeoPoint | null;
    eta: number | null;
  } | null) => void
): () => void {
  const rideRef = ref(rtdb, `active_rides/${rideId}`);

  const listener = onValue(rideRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback({
        status: data.status,
        driverLocation: data.driverLocation || null,
        eta: data.eta || null,
      });
    } else {
      callback(null);
    }
  });

  return () => off(rideRef);
}

export function removeActiveRide(rideId: string): Promise<void> {
  return set(ref(rtdb, `active_rides/${rideId}`), null);
}
