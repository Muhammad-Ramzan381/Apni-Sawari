import { GeoPoint, VehicleType } from "./user";

export type RideStatus =
  | "searching"
  | "accepted"
  | "arrived"
  | "started"
  | "completed"
  | "cancelled";

export type PaymentMethod = "cash" | "jazzcash" | "easypaisa";

export interface RideLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface RideFare {
  base: number;
  perKm: number;
  distance: number;
  waiting: number;
  surge: number;
  total: number;
  commission: number;
}

export interface Ride {
  id: string;
  riderId: string;
  driverId?: string;
  status: RideStatus;
  pickup: RideLocation;
  dropoff: RideLocation;
  stops: RideLocation[];
  vehicleType: VehicleType;
  fare: RideFare;
  distance: {
    estimated: number;
    actual: number;
  };
  duration: {
    estimated: number; // minutes
    actual: number;
  };
  isSurge: boolean;
  surgeMultiplier: number;
  paymentMethod: PaymentMethod;
  rating: {
    rider?: number;
    driver?: number;
  };
  isCourier: boolean;
  parcelPhoto?: string;
  routePath: Array<GeoPoint & { timestamp: number }>;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  cancellation?: {
    by: "rider" | "driver";
    reason: string;
    penalty: number;
  };
}
